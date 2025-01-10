import { useState, KeyboardEvent } from "react";
import InputPrompt from "./InputPrompt";
import useRegisterUser from "../hooks/useRegisterUser";
export default function SignInPrompts(){
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ stepCount, setStepCount ] = useState(1);
    const { register, errorMessage } = useRegisterUser();


    const handleUsernameInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
       if(e.key == 'Enter')
        setStepCount(prev => prev + 1);
      };

      const handleRegister =async (e: KeyboardEvent<HTMLInputElement> )=>{
       if(e.key == 'Enter'){
        register({ name, lastName, email, password,username}).catch(()=> {
          setStepCount(1);
          setName('');
          setLastName('');
          setPassword('');
          setEmail('');
          setUsername('');
        });
       }
      }
     
    return (
      <>
      {
        errorMessage && <p>{errorMessage}</p>
      }
       {
         stepCount > 0  && <InputPrompt handleKeyDown={handleUsernameInputKeyDown} setInputData={setUsername} inputData={username} promptInfo={{ tittle: "Ingrese un nombre de usuario"}} focused={ stepCount == 1}/> 
       }
       {
         stepCount > 1 && <InputPrompt handleKeyDown={handleUsernameInputKeyDown} setInputData={setName} inputData={name} promptInfo={{ tittle:"Ingrese su nombre"}} focused={ stepCount == 2}/> 
       }
       {
        stepCount > 2 && <InputPrompt handleKeyDown={handleUsernameInputKeyDown} setInputData={setLastName} inputData={lastName} promptInfo={{ tittle: "Ingrese su apellido"}} focused={ stepCount == 3}/> 
       }
       {
         stepCount > 3 && <InputPrompt handleKeyDown={handleUsernameInputKeyDown} setInputData={setEmail} inputData={email} promptInfo={{ tittle: "Ingrese su email" }} focused={ stepCount == 4}/> 
       }
       {
        stepCount > 4 && <InputPrompt handleKeyDown={handleRegister} setInputData={setPassword} inputData={ password } promptInfo={{ tittle: "Escriba una contraseña"}} focused={ stepCount == 5}/> 
       }  
      </>
    )
}