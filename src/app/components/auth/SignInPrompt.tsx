import { useState, KeyboardEvent } from "react";
import InputPrompt from "../terminal/InputPrompt";
import { signIn } from "next-auth/react";

export default function SignInPrompts(){
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ logInerror, setLogInError] = useState(false);


    const handleUsernameInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
       if(e.key == 'Enter')
        setShowPassword(true);
      };

      const handleSignin =async (e: KeyboardEvent<HTMLInputElement> )=>{
       if(e.key == 'Enter'){
        const res = await signIn('credentials', { username, password, redirect: false })
        if(res?.error){
          setUsername('');
          setPassword('');
          setShowPassword(false);
          setLogInError(true);
          return;
        }
       }
      }
    return (
      <>
      {
        logInerror && (<p className="text-sm text-red-600">Usuario o contraseña incorrecto, vuelve a intentarlo</p>)
      }
      <InputPrompt handleKeyDown={handleUsernameInputKeyDown} setInputData={setUsername} inputData={username} promptInfo={{tittle:"Usuario"}} focused ={!showPassword} />
      {
        showPassword && <InputPrompt handleKeyDown={handleSignin} setInputData={setPassword} inputData={password} promptInfo={{tittle:"Password"}} focused = {showPassword} type="password" />
      }
      </>
    )
}