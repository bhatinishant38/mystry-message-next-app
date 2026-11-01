
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, code } = await request.json();

    if (!username || !code) {
      return Response.json(
        {
          success: false,
          message: "Username and verification code are required",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      username: username,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        {
          success: true,
          message: "Account is already verified",
        },
        { status: 200 }
      );
    }

    const isCodeValid = String(user.verifyCode) === String(code);

    const isCodeNotExpired =
      user.verifyCodeExpiry &&
      new Date(user.verifyCodeExpiry).getTime() > Date.now();

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code. Please try again.",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;

    // Prevent reuse of the verification code
    user.verifyCode = "";
    user.verifyCodeExpiry = new Date(0);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error verifying user:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error while verifying account",
      },
      { status: 500 }
    );
  }
}
