import React, { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { TypeLoginButton } from "./components";

function InputBox({ ref,
  imgSrc,
  placeholder,
  type,
}: {
  type: string,
  ref: RefObject<HTMLInputElement | null>,
  imgSrc: string,
  placeholder: string
}) {
  return <div className="flex items-stretch h-12">
    <img src={imgSrc} className=" my-1 mx-1" />
    <input ref={ref} type={type} id="email" placeholder={placeholder}
      className="w-65  p-4 border border-neutral-500 my-1 mx-1 rounded-xl focus:border-cyan-100" />
  </div>
}

export function PageLoginSignUp({
  login,
  signUp,
  emailInputRef,
  passwordInputRef,
  usernameInputRef,
  errMsg,
  loader,
  previous,
  setLogin,
  setSignUp,
  Submit,
}: {
  previous: string | {},
  login: boolean,
  signUp: boolean,
  emailInputRef: RefObject<HTMLInputElement | null>,
  passwordInputRef: RefObject<HTMLInputElement | null>,
  usernameInputRef: RefObject<HTMLInputElement | null>,
  errMsg: { message: string, color: string },
  loader: boolean,
  setLogin: Dispatch<SetStateAction<boolean>>,
  setSignUp: Dispatch<SetStateAction<boolean>>,
  Submit: () => Promise<void>;
}) {

  const [formMount, setFormMount] = useState<boolean>(false);
  useEffect(() => {
    setFormMount(true);
  }, [])

  return (
    <div className={`bg-white relative flex flex-col w-2/6 h-3/5 items-center justify-center 
  border-2 border-neutral-300 rounded-xl shadow-xl p-5
${formMount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} transform duration-500
 transition delay-100`}>

      {/*Top Text*/}
      <div className="prose prose-sm absolute  top-0 m-4">
        <h3 className={`hover:-translate-y-1 transition delay-75 text-neutral-700
          transform duration-1000 
${formMount ? "opacity-100" : "opacity-0"}`}>
          {login ? "Don't have an account?" : "Already have an account?"}
          <a className="text-amber-300 font-semibold cursor-pointer"
            onClick={() => {
              if (login) {
                setLogin(false);
                setSignUp(true);
              }
              else if (signUp) {
                setLogin(true);
                setSignUp(false);
              }
            }}>
            {login ? "Sign up today!" : "Login!"}
          </a>
        </h3>
      </div>

      <img src="/unlock.png" className={`animate-bounce w-15 h-15 object-fill m-2
    ${formMount ? "opacity-100" : "opacity-0"} transform duration-1000 transition delay-1000`} />

      <h3 className="text-neutral-700 my-2 font-semibold">
        {login ? "Login is required to access further content" :
          "access the best coding platform today!"}
      </h3>

      <InputBox type="email" ref={emailInputRef} imgSrc="/mail.png" placeholder="your email goes here" />

      {signUp && <InputBox type="text" ref={usernameInputRef} imgSrc="/user.png" placeholder="your username goes here" />}

      <InputBox type="password" ref={passwordInputRef} imgSrc="/globe.png" placeholder="your password goes here" />

      {/*Submit*/}
      <TypeLoginButton
        display={(login ? "Login" : "SignUp")}
        doThisAsync={() => Submit()}
      />
    </div>
  )
}
