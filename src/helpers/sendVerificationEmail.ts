import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: false,
      message: "Verification email Send Success",
    };
  } catch (error) {
    console.error("Error While Sending verificaton Email", error);
    return {
      success: false,
      message: "Verification email failed",
    };
  }
}
