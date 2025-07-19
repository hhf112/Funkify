import React from "react";
import { useRef, useState, useContext } from "react"
import { sessionContext, type sessionContextType } from "../contexts/SessionContextProvider";
import { LoginForm } from "./LoginForm";
import { LoginSubmitted } from "./LoginSubmitted";
import { Disclaimer, TypeLoginButton } from "./TypesElement";
import { useNavigate } from "react-router-dom";

const authentication: string = import.meta.env.VITE_AUTH || "";



export function Login() {
  /* use */
  const { setUser, setSessionToken, sessionToken, user } = useContext<sessionContextType>(sessionContext);
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate();

  /* states */
  const [login, setLogin] = useState<boolean>(true);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  async function Logout() {
    try {
      const post = await fetch(`${authentication}/logout`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include"
      })
      const postJSON = await post.json();
      // console.log(postJSON);
      setSessionToken("");
      setSubmitted(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function Submit() {
    const username = usernameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const req = authentication + (login ? "/login" : "/register");
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
      }),
      credentials: "include",
    })

    const postJSON = await post.json();
    // console.log(postJSON);
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
    <div className="h-screen w-full"> {/*BG*/}
      <div className="flex h-screen justify-center items-center">
        {submitted || sessionToken.length ? <LoginSubmitted
          login={login}
          signUp={signUp}
          setSignUp={setSignUp}
          setLogin={setLogin}
          setSubmitted={setSubmitted}
          Submit={Submit}
          Logout={Logout}

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

