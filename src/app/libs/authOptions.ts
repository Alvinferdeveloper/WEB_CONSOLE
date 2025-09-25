import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/app/libs/db";
import { JWT } from "next-auth/jwt";
import NextAuth, { Session } from "next-auth";
import argon2 from 'argon2'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                const user = await db.user.findFirst({
                    where: { username: credentials?.username },
                })
                if (user && credentials?.password) {
                    const match = await argon2.verify(user?.password, credentials?.password);
                    console.log(match)
                    if (match) return {
                        id: String(user.id),
                        name: user.username,
                    };
                }

                // Return null if the credentials are invalid
                return null;
            }
        })
    ],

    callbacks: {
        session: ({ session, token }: { session: Session, token: JWT }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),


    },

    session: {
        maxAge: 600000
    }
    ,
    pages: {
        signIn: '/',
        signOut: '/',
    }
}

export const handler = NextAuth(authOptions);