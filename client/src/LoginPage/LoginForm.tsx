import type { Dispatch, RefObject, SetStateAction } from "react";

export function LoginForm({
  login,
  signUp,
  emailInputRef,
  passwordInputRef,
  usernameInputRef,
  setLogin,
  setSignUp,
  Submit,
}: {
  login: boolean,
  signUp: boolean,
  emailInputRef: RefObject<HTMLInputElement | null>,
  passwordInputRef: RefObject<HTMLInputElement | null>,
  usernameInputRef: RefObject<HTMLInputElement | null>,
  setLogin: Dispatch<SetStateAction<boolean>>,
  setSignUp: Dispatch<SetStateAction<boolean>>,
  Submit: () => Promise<void>;
}) {
  return (
    <div className="bg-white relative flex flex-col w-2/5 h-3/5 items-center justify-center border border-neutral-500 shadow-xl p-15">

      {/*Top Text*/}
      <div className="prose prose-sm absolute  top-0 m-4">

        <h3 className="text-neutral-700">
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
        <input ref={passwordInputRef} type="email" id="email " placeholder="your password goes here" className="w-65  p-4 border border-neutral-500 my-1 mx-1" />
      </div>

      {/*Submit*/}
      <button onClick={() => Submit()}
        className="cursor-pointer hover:bg-neutral-500 my-4 text-lg border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 
          shadow-neutral-500 shadow-lg">
        {login ? "Login" : "Signup"}
      </button>
    </div>
  )
}
