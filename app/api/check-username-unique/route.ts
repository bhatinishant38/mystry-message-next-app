import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {success, z} from 'zod'
import { usernameValidation } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request: Request){
    await dbConnect()

    try {
        const { searchParams} = new URL(request.url)
        const quesyParam = {
            username : searchParams.get('username')
        }
        
    } catch (error) {
        console.error("Error Checking username" , error)
        return Response.json({
            success: false ,
            message : " Error checking username"
        },
       {status : 500}
      )
        
    }
}