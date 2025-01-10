import { signIn } from "next-auth/react";
import { useState } from "react";
interface User{
    name: string,
    email: string,
    lastName: string,
    username: string,
    password: string
}

export default function useRegisterUser(){
    const [ errorMessage, setErrorMessage ] = useState(''); 
    const register = async (user: User)=>{
        try {
            const res = await fetch('http://localhost:3000/api/user',{
                method: 'POST',
                body: JSON.stringify(user)
            });
            if(!res.ok){
                throw new Error("Datos invalidos, por favor vuelve a ingresarlos");
            }
            await signIn('credentials', { user: user.username, password: user.password, redirect: false })
        }catch(err){
            const error = err as Error;
            setErrorMessage(error?.message || "Ocurrio un error en el servidor");
            throw new Error();
        }

    }

    return { register, errorMessage}
}