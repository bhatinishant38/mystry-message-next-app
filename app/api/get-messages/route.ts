import { getServerSession } from "next-auth";
import { authOptions} from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from "@/models/User";
import { User } from 'next-auth'
import mongoose from "mongoose";

export async function GET(request : Request){
   await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success : false ,
            message : "Not Authenticated"
        },
        { status : 404}
    )
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const foundUser = await UserModel.findById(userId).select('message')
        if (!foundUser) {
            return Response.json(
                {
                    success : false ,
                    message : "User not found"
                },
                { status : 401}
            )
        }
         return Response.json(
                {
                    success : true,
                    messages : [...foundUser.message].sort(
                        (first, second) =>
                            second.createdAt.getTime() - first.createdAt.getTime(),
                    ),
                },
                { status : 200}
            )
        
    } catch (error) {
        console.log("An unexpected error occured :", error)
        return Response.json(
            {
                success : false ,
                message : "An unexpected error occurred"
            },
            { status : 500}
        )
        
    }
}