import { useRef, useState, useContext } from "react"
import { sessionContext, type sessionContextType } from "../contexts/SessionContextProvider";
import { LoginForm } from "./LoginForm";
import { LoginSubmitted } from "./LoginSubmitted";

const backend: string = import.meta.env.VITE_AUTH || "";



export function Login() {
  /* use */
  const { setUser, setSessionToken } = useContext<sessionContextType>(sessionContext);
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)

  /* states */
  const [login, setLogin] = useState<boolean>(true);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  async function Submit() {
    const username = usernameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const req = backend + (login ? "/login" : "/register");
    setLoader(true);
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
    setLoader(false);
    if (!post.ok) {
      setErrMsg(postJSON.message);
      return;
    }
    setErrMsg("");
    if (login) {
      const user = postJSON.user;
      setSessionToken(postJSON.accessToken);
      setUser({
        isValid: true,
        username: user.username,
        email: user.email,
        password: user.password,
        userId: user._id.toString(),
      });
      setSubmitted(true);
    } if (signUp) {
      setSubmitted(true);
    }
  }

  return (
    <div className="bg-[url('/login-bg.png')]  bg-cover bg-center h-screen w-full"> {/*BG*/}
      <div className="flex h-screen justify-center items-center">
        {submitted ? <LoginSubmitted
          login={login}
          signUp={signUp}
          setSignUp={setSignUp}
          setLogin={setLogin}
          setSubmitted={setSubmitted}
          Submit={Submit}

        /> : <LoginForm
          login={login}
          signUp={signUp}
          emailInputRef={emailInputRef}
          passwordInputRef={passwordInputRef}
          usernameInputRef={usernameInputRef}
          errMsg={errMsg}
          loader={loader}
          setLogin={setLogin}
          setSignUp={setSignUp}
          Submit={Submit}
        />}
      </div>
    </div>
  )
}

