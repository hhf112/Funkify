import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { sessionContext } from "../contexts/SessionContextProvider"
import { useNavigate } from "react-router-dom";
import { TypeLoginButton, Disclaimer } from "./TypesElement";

export function LoginSubmitted({
  login,
  signUp,
  setSignUp,
  setLogin,
  setSubmitted,
  Submit,
  Logout,
}: {
  login: boolean,
  signUp: boolean,
  setLogin: Dispatch<SetStateAction<boolean>>,
  setSignUp: Dispatch<SetStateAction<boolean>>,
  setSubmitted: Dispatch<SetStateAction<boolean>>,
  Submit: () => Promise<void>,
  Logout: () => Promise<void>,
}) {
  /* states */
  const navigate = useNavigate();
  const { user } = useContext(sessionContext);
  const [mountDoor, setMountDoor] = useState<boolean>(false);

  useEffect(() => setMountDoor(true), []);

  return (
    <div className="bg-white relative flex flex-col w-2/6 h-3/5 items-center justify-center 
      rounded-xl border border-neutral-300 shadow-xl p-15">

      {/*Top Text*/}
      <div className="prose prose-sm absolute  top-0 m-4">
        <h3 className="text-neutral-700">
          {`Welcome back ${user.username}!`}
        </h3>
      </div>

      {/*Banner */}
      <div className={`${mountDoor ? "opacity-100 translate-y-2" : "opacity-0 translate-y-2"} 
      transform duration-400 transition-all delay-500`}>
        <img src="/logged-in.png" className="w-25 h-25 object-fill m-2" />
      </div>
      <Disclaimer
        display={login ? "Logged in successfully!" : "Account created successfully!"}
        colorClass="green"
      />
      {login &&
        <div className="flex">
          <TypeLoginButton
            display="Continue to Homepage!"
            doThisAsync={() => navigate("/")}
          />
          <TypeLoginButton
            display="Logout"
            doThisAsync={() => Logout()}
          />
        </div>
      }

      {signUp &&
        <TypeLoginButton
          doThisAsync={() => {
            setSubmitted(false);
            setLogin(true);
            setSignUp(false);
          }}
          display="Continue to Login"
        />
      }
    </div>
  )
}
