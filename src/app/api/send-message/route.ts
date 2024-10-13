import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    //assertion is being used here because the w/o assertion it will throw an error as our model is defined like that
    user.messages.push(newMessage as Message); // (as Message) is assertion

    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Something went wrong on the server side" },
      { status: 500 }
    );
  }
}
