import { useState, KeyboardEvent } from "react";
import InputPrompt from "../terminal/InputPrompt";
import { signIn } from "next-auth/react";

export default function SignInPrompts() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logInerror, setLogInError] = useState(false);


  const handleUsernameInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter')
      setShowPassword(true);
  };

  const handleSignin = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      const res = await signIn('credentials', { username, password, redirect: false })
      if (res?.error) {
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
      <p className="text-xl text-center">Inicio de sesión</p>
      {logInerror && (
        <div className="border-2 border-red-500 text-sm bg-red-900 bg-opacity-20 p-2 my-2">
          <p className="text-red-400 font-bold">[SYSTEM_ERROR]</p>
          <p className="text-red-400 whitespace-pre-wrap">
            - Usuario o contraseña incorrecto, vuelve a intentarlo
          </p>
        </div>
      )}
      <InputPrompt handleKeyDown={handleUsernameInputKeyDown} setInputData={setUsername} inputData={username} promptInfo={{ tittle: "Usuario" }} focused={!showPassword} />
      {
        showPassword && <InputPrompt handleKeyDown={handleSignin} setInputData={setPassword} inputData={password} promptInfo={{ tittle: "Password" }} focused={showPassword} type="password" />
      }
    </>
  )
}