import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }
    const isCodeValid = user.verifyCode == code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully",
        },
        { status: 202 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Code is Expired please sign up again to get verifies",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification Code ",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying code ", error);
    return NextResponse.json(
      { success: false, message: "Error Verify code" },
      { status: 500 }
    );
  }
}
