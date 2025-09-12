import { ApiError } from "../utils/ApiError"
import db from "@/app/libs/db"
import argon2 from 'argon2';

interface User {
    name: string,
    email: string,
    lastName: string,
    username: string,
    password: string
}
export async function register(user: User){
    const userExist = await db.user.findFirst({ where: { username: user.username}});
    if( userExist ){
      throw new ApiError(409, "El nombre de usuario ya existe");
    }
    const hash = await argon2.hash(user.password);

    const { userDoc } = await db.$transaction(async (db) => {
        const userDoc = await db.user.create({ data: {...user, password: hash}});
        await db.directory.create({
          data: {
           name:'/',
           userId: userDoc.id,
           absolutePath:'/'
          },
        });
        return { userDoc };
      });
   
    return userDoc;
}