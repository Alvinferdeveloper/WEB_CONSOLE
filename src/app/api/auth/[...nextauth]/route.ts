import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import db from "@/app/libs/db";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions = {
    providers: [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    
    async authorize(credentials, req) {
       const user = await db.user.findFirst({where:{
        username:credentials?.username,
        password:credentials?.password
       }})
       if(user) return {
        id:String(user.id),
        name:user.username,
       };

      // Return null if the credentials are invalid
      return null;
      
    }
  })
],

callbacks: {
  session: ({ session, token }:{session:Session, token:JWT}) => ({
    ...session,
    user: {
      ...session.user,
      id:token.sub,
    },
  }),

  
},

session:{
  maxAge:600000
}
,
pages:{
  signIn:'/',
  signOut:'/',
}
}



export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}; 
