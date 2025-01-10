import { ApiError } from "../utils/ApiError"
import isUserValid from "../utils/validation"
import db from "@/app/libs/db"

interface User {
    name: string,
    email: string,
    lastName: string,
    username: string,
    password: string
}
export async function register(user: User){
    if( !isUserValid(user) ){
        throw new ApiError(422, "Invalid user data");
    }
    const { userDoc } = await db.$transaction(async (db) => {
        const userDoc = await db.user.create({ data: user});
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