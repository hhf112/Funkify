import { useRef, useState, useContext } from "react"
import { sessionContext, type sessionContextType } from "../contexts/SessionContextProvider";
import { LoginForm } from "./LoginForm";

const backend: string = import.meta.env.VITE_BACKEND || "";


export function Login() {
  /* use */
  const { user, setUser, setSessionToken } = useContext<sessionContextType>(sessionContext);
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)

  /* states */
  const [login, setLogin] = useState<boolean>(true);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [submittedlogin, setSubmittedLogin] = useState<boolean>(true);
  const [submittedsignUp, setSubmittedSignUp] = useState<boolean>(false);

  async function Submit() {
    const username = usernameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const req = backend + (login ? "/login" : "/register");
    const post = await fetch(req, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      })
    })
    const postJSON = await post.json();
    if (login) {
      setSubmittedLogin(true);
      setSessionToken(postJSON.accessToken);
      setUser(postJSON.user);
    } if (signUp) {

    }
  }

  return (
    <div className="bg-[url('/login-bg.png')] bg-cover bg-center h-screen w-full"> {/*BG*/}
      <div className="flex h-screen justify-center items-center">
        <LoginForm
          login={login}
          signUp={signUp}
          emailInputRef={emailInputRef}
          passwordInputRef={passwordInputRef}
          usernameInputRef={usernameInputRef}
          setLogin={setLogin}
          setSignUp={setSignUp}
          Submit={Submit}
        />
        {/*Submitted form to be added*/}
      </div>
    </div>
  )
}

