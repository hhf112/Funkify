import { useContext, type Dispatch, type RefObject, type SetStateAction } from "react";
import { sessionContext } from "../contexts/SessionContextProvider"

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

  const { user } = useContext(sessionContext);
  return (
    <div className="bg-white relative flex flex-col w-2/5 h-3/5 items-center justify-center border border-neutral-500 shadow-xl p-15">

      {/*Top Text*/}
      <div className="prose prose-sm absolute  top-0 m-4">

        <h3 className="text-neutral-700">
          {user.isValid ? "Trying to log you in ...": `Welcome ${user.username}!`}
        </h3>
      </div>

      {/*Banner */}
      <img src="/unlock.png" className="animate-bounce w-15 h-15 object-fill m-2" />
      <h3 className="text-neutral-700 my-2 font-semibold">
        {login ? "Login is required to access further content" : "access the best coding platform today!"}
      </h3>


      {/*Submit*/}
      <button onClick={() => Submit()}
        className="cursor-pointer hover:bg-neutral-500 my-4 text-lg border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 
          shadow-neutral-500 shadow-lg">
        {login ? "Continue" : "Try again"}
      </button>
    </div>
  )
}
export function LoginSubmitted() {

}
