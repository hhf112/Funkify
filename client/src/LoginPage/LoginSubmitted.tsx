import { useContext, type Dispatch, type SetStateAction } from "react";
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
}: {
  login: boolean,
  signUp: boolean,
  setLogin: Dispatch<SetStateAction<boolean>>,
  setSignUp: Dispatch<SetStateAction<boolean>>,
  setSubmitted: Dispatch<SetStateAction<boolean>>,
  Submit: () => Promise<void>;
}) {
  const navigate = useNavigate();
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
            display="Login"
            doThisAsync={() => Submit()}
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
