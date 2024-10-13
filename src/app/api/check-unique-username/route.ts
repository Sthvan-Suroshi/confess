import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    // query string from url
    const { searchParams } = new URL(req.url);

    //queryParam must be object
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate query string
    const res = usernameQuerySchema.safeParse(queryParam);

    if (!res.success) {
      const usernameError = res.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = res.data;

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "Username is taken" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error checking username: ", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
