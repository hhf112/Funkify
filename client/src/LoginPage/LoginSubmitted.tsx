import { useContext, type Dispatch, type SetStateAction } from "react";
import { sessionContext } from "../contexts/SessionContextProvider"

export function LoginSubmitted({
  login,
  signUp,
  setLogin,
  setSubmitted,
  Submit,
}: {
  login: boolean,
  signUp: boolean,
  setLogin: Dispatch<SetStateAction<boolean>>,
  setSubmitted: Dispatch<SetStateAction<boolean>>,
  Submit: () => Promise<void>;
}) {
  const { user } = useContext(sessionContext);
  return (
    <div className="bg-white relative flex flex-col w-2/6 h-3/5 items-center justify-center border border-neutral-500 shadow-xl p-15">

      {/*Top Text*/}
      <div className="prose prose-sm absolute  top-0 m-4">
        <h3 className="text-neutral-700">
          {`Welcome back ${user.username}!`}
        </h3>
      </div>

      {/*Banner */}
      <img src="/logged-in.png" className="w-25 h-25 object-fill m-2" />
      <div className="border border-neutral-700 p-2 bg-green-400">
        <h2 className="text-white font-semibold animate-pulse"> {login ? "Logged in successfully!" : "Account created successfully!"} </h2>
      </div>


      {login &&
        <div className="flex">
          <button onClick={() => Submit()}
            className="cursor-pointer hover:bg-neutral-500 my-4 text-lg border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 
          shadow-neutral-500 shadow-lg mx-2">
            Continue to Homepage!
          </button>
          <button onClick={() => Submit()}
            className="cursor-pointer hover:bg-neutral-500 my-4 text-lg border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 
          shadow-neutral-500 shadow-lg">
            Logout
          </button>
        </div>
      }

      {signUp &&
        <button onClick={() => {
          setSubmitted(false);
          setLogin(true);
        }}
          className="cursor-pointer hover:bg-neutral-500 my-4 text-lg border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 
          shadow-neutral-500 shadow-lg mx-2">
          Continue to Login!
        </button>
      }
    </div>
  )
}
