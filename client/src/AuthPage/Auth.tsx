import React from "react";
import { useRef, useState, useContext } from "react"
import { sessionContext, type sessionContextType } from "../contexts/SessionContextProvider";
import { PageLoginSignUp } from "./PageLoginSignUp";
import { PageSubmittedLoginSignUp } from "./PageSubmittedLoginSignUp";
import { Disclaimer, TypeLoginButton } from "./components";
import { useLocation, useNavigate } from "react-router-dom";
import { preview } from "vite";

const authentication: string = import.meta.env.VITE_AUTH || "";



export function Auth() {
  /* use */
  const { Logout, setUser, setSessionToken, sessionToken, user } = useContext<sessionContextType>(sessionContext);
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate();
  const location = useLocation();
  const { previous }: { previous: string } = location.state || {};

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

  /* component */
  return (
    <div className="h-screen w-full"> {/*BG*/}

      <div className="fixed flex justify-center items-center w-full">
        <button className="m-5 text-4xl rounded-full p-5 bg-white text-neutral-800 
           font-bold border-4 font-Inter z-5 shadow cursor-pointer
           hover:bg-red-400 hover:-translate-x-5
          transition-all transform duration-100 delay-75"
        onClick={()=>navigate(previous)}>
          NO. TAKE ME BACK.
        </button>
      </div>

      <div className="flex h-screen justify-center items-center">
        {submitted || sessionToken.length ? <PageSubmittedLoginSignUp
          login={login}
          previous={previous}
          signUp={signUp}
          setSignUp={setSignUp}
          setLogin={setLogin}
          setSubmitted={setSubmitted}
          Submit={Submit}
          Logout={Logout}

        /> : <PageLoginSignUp
          previous={previous}
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

