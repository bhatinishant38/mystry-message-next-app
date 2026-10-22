import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }

        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user || !user.isVerified) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  callbacks :{
    async jwt({token ,user}){
     if (user) {
      token._id = user._id?.toString()
      token.isVerified = user.isVerified
      token.isAcceptingMessages = user.isAcceptingMessages;
      token.username = user.username
     }
     return token
    },
    async session({session , token}) {
      if(token){
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username = token.username
      }
      return session
    },

  },
  pages :{
    signIn : "/signin"
  },
  session : {
    strategy : "jwt"
  },
  secret  : process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
