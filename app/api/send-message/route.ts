import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { Message } from '@/models/User'
import { MessagesSchema } from '@/Schemas/messageSchema'
import { z } from 'zod'

export async function POST(request: Request) {
    try {
        const parsedRequest = MessagesSchema.extend({
            username: z.string().trim().min(1, 'A valid username is required'),
        }).safeParse(await request.json())

        if (!parsedRequest.success) {
            return Response.json(
                {
                    success: false,
                    message: parsedRequest.error.issues[0]?.message || 'Invalid request',
                },
                { status: 400 },
            )
        }

        await dbConnect()
        const { username, content } = parsedRequest.data
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success : false ,
                    message : "User not found"
                },
                {
                     status : 404
                }
            )
        }
        // is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success : false ,
                    message : "User is not accepting the messages"
                },
                { status : 403}
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.message.push(newMessage as Message)
        await user.save()

         return Response.json(
            {
                success : true,
                message : "Message sent successfully"
            },
            { status : 200}
         )
        
    } catch (error) {
        console.log("Error adding messages :", error)
        return Response.json(
            {
                success : false ,
                message : "Internal server error"
            },
            { status : 500}
        )
        
    }

}