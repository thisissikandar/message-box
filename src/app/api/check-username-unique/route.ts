import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernamequerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };
    const result = usernamequerySchema.safeParse(queryParams);
    console.log("result::", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid Query Parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
   const existingVerifiedUser=  await UserModel.findOne({ username, isVerified: true });

   if(existingVerifiedUser){
    return Response.json(
      {
        success: false,
        message: "Username is Already taken",
      },
      { status: 400 }
    );
   }
   return Response.json(
    {
      success: false,
      message:"username is unique",
    },
    { status: 400 }
  );
  } catch (error) {
    console.error("ERROR Checking Usernam", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking Usern",
      },
      {
        status: 500,
      }
    );
  }
}
