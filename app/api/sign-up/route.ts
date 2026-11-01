
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { randomInt } from "crypto";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Username, email and password are required",
        },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    // Check whether this email already exists
    const existingUserByEmail = await UserModel.findOne({
      email: cleanEmail,
    });

    // Already verified account
    if (existingUserByEmail?.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        { status: 409 }
      );
    }

    // Check username availability, excluding the same
    // unverified user's existing database record
    const usernameQuery: any = {
      username: cleanUsername,
    };

    if (existingUserByEmail) {
      usernameQuery._id = {
        $ne: existingUserByEmail._id,
      };
    }

    const existingUserByUsername = await UserModel.findOne(
      usernameQuery
    );

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 409 }
      );
    }

    // Generate a secure six-digit verification code
    const verifyCode = randomInt(100000, 1000000).toString();

    // OTP expires after 10 minutes
    const verifyCodeExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail) {
      // Update existing unverified user
      existingUserByEmail.username = cleanUsername;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;

      await existingUserByEmail.save();
    } else {
      // Create new user
      const newUser = new UserModel({
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      cleanEmail,
      cleanUsername,
      verifyCode
    );

    if (!emailResponse.success) {
      console.error(
        "Verification email failed:",
        emailResponse.message
      );

      return Response.json(
        {
          success: false,
          message: "Account saved, but verification email could not be sent. Please try again.",
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected registration error",
      },
      { status: 500 }
    );
  }
}
