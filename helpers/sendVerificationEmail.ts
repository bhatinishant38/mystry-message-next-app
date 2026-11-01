
import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const from = process.env.RESEND_FROM_EMAIL;

    if (!from) {
      console.error("RESEND_FROM_EMAIL is missing");

      return {
        success: false,
        message: "Email sender is not configured.",
      };
    }

    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: "Verify your account",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    if (error) {
      console.error("Resend API error:", error);

      return {
        success: false,
        message: error.message,
      };
    }

    console.log("Verification email sent:", data?.id);

    return {
      success: true,
      message: "Verification email sent successfully",
    };

  } catch (error) {
    console.error("Email sending failed:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unexpected email error",
    };
  }
}
