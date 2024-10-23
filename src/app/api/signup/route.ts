import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();
    const exisitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (exisitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "user already taken",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already existed with this email address",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }
    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    console.log("emailResponse :: " + emailResponse);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Registered Successfullly please verify your email",
      },
      { status: 500 }
    );
  } catch (error) {
    console.log("Error registering User", error);
    return Response.json(
      { success: false, message: "Error registering User" },
      { status: 500 }
    );
  }
}
