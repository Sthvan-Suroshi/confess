import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const user = session?.user as User;

  // this is because we have written _id as type string so we need to convert it to ObjectId to write aggregate query
  const userId = new mongoose.Types.ObjectId(user?._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "User found", messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
