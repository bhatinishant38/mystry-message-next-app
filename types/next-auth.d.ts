import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User {
        _id? : string ;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: boolean;
    }
    interface Session {
        user : {
             _id? : string ;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: boolean;
        } & DefaultSession['user']
    }
}