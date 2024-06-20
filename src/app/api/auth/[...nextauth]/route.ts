import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import db from "@/app/libs/db";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const authOptions = {
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

       console.log(user?.id, user?.username)
       console.log(user);
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
  maxAge:60000
}
,
pages:{
  signIn:'/',
  signOut:'/',
}
}



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}; 
