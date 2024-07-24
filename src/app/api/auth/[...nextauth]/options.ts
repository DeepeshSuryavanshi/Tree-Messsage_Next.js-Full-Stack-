import { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { promises } from "dns";


export const authOPtions : NextAuthOptions = {
   providers:[
    CredentialsProvider({
        id: "credentials",
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          }, 
          async authorize(credentials:any):Promise<any>{
            await dbConnect()
            try {
             const user = await UserModel.findOne({
                $or:[
                  {email:credentials.identifier},
                  {username:credentials.identifier}
                ]
              })
              
              if(!user){
                throw new Error("User Not found with this Email or Username")
              }
              if(!user.isVerified){
                throw new Error("Please verified your account Befor Login!")
              }
            const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
            if (isPasswordCorrect) {
              return user
            }
            else{
              throw new Error("Incorrect Password")
            }
            } catch (err:any) {
              console.log(err);
              throw new Error(err)
            }
          }  
    })
   ],
   callbacks: {
    async jwt({ token, user }) {
      if(user)
        {
          token._id = user._id?.toString()
          token.isVerified = user.isVerified
          token.isAcceptingMessage = user.isAcceptingMessage
          token.username = user.username
        }
      return token
    }
    ,
    async session({ session, token }) {
      if(token){
        session.user._id = token._id 
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessage = token.isisAcceptingMessage
        session.user.username = token.username
      }
      return session
      }
   },
   session:{
    strategy:'jwt'
   },
   pages:{
    signIn: '/sign-in',
     },
     secret:process.env.NEXTAUTH_SECRET
}