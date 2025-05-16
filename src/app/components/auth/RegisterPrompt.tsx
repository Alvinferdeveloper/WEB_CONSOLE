import { useState, KeyboardEvent } from "react";
import InputPrompt from "../terminal/InputPrompt";
import useRegisterUser from "../../hooks/useRegisterUser";

const steps = [
  { key: "username", title: "Ingrese un nombre de usuario" },
  { key: "name", title: "Ingrese su nombre" },
  { key: "lastName", title: "Ingrese su apellido" },
  { key: "email", title: "Ingrese su email" },
  { key: "password", title: "Escriba una contraseña", type: "password" },
];
export default function RegisterPrompt() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [stepCount, setStepCount] = useState(1);
  const { register, errorMessage } = useRegisterUser();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>, key: string) => {
    if (e.key !== "Enter") return;

    if (key === "password") {
      register(formData).catch(() => {
        setStepCount(1);
        setFormData({ username: "", name: "", lastName: "", email: "", password: "" });
      });
    } else {
      setStepCount((prev) => prev + 1);
    }
  };

  return (
    <>
      <p className="text-xl text-center">Proceso de registro</p>
      {errorMessage.split(/\n/).map((err, index) => (
        <p key={index} className="text-sm text-red-600">{err}</p>
      ))}

      {steps.map((step, index) => (
        stepCount > index && (
          <InputPrompt
            key={step.key}
            handleKeyDown={(e) => handleKeyDown(e, step.key)}
            setInputData={(value) => setFormData((prev) => ({ ...prev, [step.key]: value }))}
            inputData={formData[step.key as keyof typeof formData]}
            promptInfo={{ tittle: step.title }}
            focused={stepCount === index + 1}
            type={step.type || "text"}
          />
        )
      ))}
    </>
  );
}