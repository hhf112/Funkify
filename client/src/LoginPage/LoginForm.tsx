import { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { setFlagsFromString } from "v8";

export function LoginForm({
  login,
  signUp,
  emailInputRef,
  passwordInputRef,
  usernameInputRef,
  errMsg,
  loader,
  setLogin,
  setSignUp,
  Submit,
}: {
  login: boolean,
  signUp: boolean,
  emailInputRef: RefObject<HTMLInputElement | null>,
  passwordInputRef: RefObject<HTMLInputElement | null>,
  usernameInputRef: RefObject<HTMLInputElement | null>,
  errMsg: string | null,
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
    <div className={`bg-white relative flex flex-col w-2/6 h-3/5 items-center justify-center border-2 border-neutral-700 shadow-xl p-5
${formMount ? "opacity-100 -translate-y-2" : "opacity-0 translate-2"} transition delay-150`}>

      {/*Top Text*/}
      <div className="prose prose-sm absolute  top-0 m-4">

        <h3 className="hover:-translate-y-1 transition delay-100 text-neutral-700">
          {login ? "Don't have an account?" : "Already have an account?"}
          <a className="text-amber-300 font-semibold cursor-pointer"
            onClick={() => {
              if (login) {
                setLogin(false);
                setSignUp(true);
              }
              if (signUp) {
                setLogin(true);
                setSignUp(false);
              }
            }}>
            {login ? "Sign up today!" : "Login!"}
          </a>
        </h3>
      </div>

      {/*Banner */}
      <img src="/unlock.png" className="animate-bounce w-15 h-15 object-fill m-2" />
      <h3 className="text-neutral-700 my-2 font-semibold">
        {login ? "Login is required to access further content" : "access the best coding platform today!"}
      </h3>

      <div className="flex items-stretch h-12">
        <label htmlFor="email" />
        <img src="/mail.png" className="my-1 mx-1" />
        <input ref={emailInputRef} type="email" id="email " placeholder="your email goes here" className="w-65 p-4 border border-neutral-500 my-1 mx-1" />
      </div>

      {signUp && (
        <div className="flex items-stretch h-12">
          <label htmlFor="username" />
          <img src="/user.png" className="my-1 mx-1" />
          <input ref={usernameInputRef} type="email" id="email " placeholder="your username goes here" className="w-65 p-4 border border-neutral-500 my-1 mx-1" />
        </div>
      )}

      <div className="flex items-stretch h-12">
        <label htmlFor="password" />
        <img src="/globe.png" className=" my-1 mx-1" />
        <input ref={passwordInputRef} type="password" id="email " placeholder="your password goes here" className="w-65  p-4 border border-neutral-500 my-1 mx-1" />
      </div>

      {/*Submit*/}
      <button onClick={() => Submit()}
        className="cursor-pointer hover:bg-amber-300 hover:text-black my-4 text-lg border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 
          shadow-neutral-500 shadow-lg
        transition delay-100 hover:-translate-y-2 hover:scale-100">
        {login ? "Login" : "Signup"}
      </button>

      {errMsg && (
        <div className="border border-neutral-700 p-2 bg-red-400">
          <h2 className="text-white font-semibold animate-pulse">  {errMsg}</h2>
        </div>
      )}

      {loader && (
        <div className = "flex">
          <p className = "text-neutral-800"> loading ... </p>
          <img src="/loader.png" className=" animate-spin w-4 h-4 my-1 mx-1" />
        </div>
      )}
    </div>
  )
}
