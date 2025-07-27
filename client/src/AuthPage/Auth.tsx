import React, { useEffect } from "react";
import { useRef, useState, useContext } from "react"
import { sessionContext, SessionContextProvider, type sessionContextType } from "../contexts/SessionContextProvider";
import { PageLoginSignUp } from "./PageLoginSignUp";
import { PageSubmittedLoginSignUp } from "./PageSubmittedLoginSignUp";
import { Disclaimer, TypeLoginButton } from "./components";
import { useLocation, useNavigate } from "react-router-dom";

const authentication: string = import.meta.env.VITE_AUTH || "";



export function Auth() {

  /* use */
  const { Logout, setUser, setSessionToken, sessionToken, user } = useContext<sessionContextType>(sessionContext);

  const location = useLocation();
  const { previous }: { previous: string } = location.state || {};
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)


  /* states */
  const [login, setLogin] = useState<boolean>(true);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<{
    message: string,
    color: string,
  }>({
    message: "",
    color: "amber",
  });
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (sessionToken.length) navigate(previous || '/');
  }, [sessionToken]);

  useEffect(() => {
    //check if user logged in before.
    (async () => {
      if (sessionToken.length) return;

      try {
        setErrMsg({ message: "Auto logging you in if any past logins are found :) ...", color: "amber" });
        const get = await fetch(`${authentication}/token`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include"
        })
        const getJSON = await get.json();
        // console.log(getJSON);
        if (!getJSON.accessToken) {
          setErrMsg({ message: "", color: "" });
          return;
        }
        setSessionToken(getJSON.accessToken);
        setUser(getJSON.user);
        setErrMsg({
          message: "Youre Logged in! :D",
          color: "green",
        })
        setTimeout(() => setErrMsg({ message: "", color: "" }), 1000)
      } catch (err) {
        setErrMsg({ message: "", color: "amber" });
      }
    })();
  }, [])




  /*functions*/
  async function Submit() {
    const username = usernameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const req = authentication + (login ? "/login" : "/register");
    setErrMsg({
      message: "Loading ...",
      color: "amber",
    })

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
    if (!post.ok) {
      setErrMsg({
        message: postJSON.message,
        color: "amber"
      });
      return;
    }
    setErrMsg({
      message: "",
      color: "amber",
    });

    if (login) {
      const user = postJSON.user;
      setSessionToken(postJSON.accessToken);
      setUser(postJSON.user);
      setSubmitted(true);
    } if (signUp) {
      setSubmitted(true);
    }
  }

  /* component */
  // console.log(sessionToken);
  return (
    <div> {/*BG*/}

      <div className="fixed flex justify-center items-center w-full">
        <button className="m-5 text-4xl rounded-full p-5 bg-white text-neutral-800 
           font-bold border-4 font-Inter z-5 shadow cursor-pointer
           hover:bg-red-400 hover:-translate-x-5
          transition-all transform duration-100 delay-75"
          onClick={() => navigate(previous || "/")}>
          NO. TAKE ME BACK.
        </button>
      </div>

      <div className="flex w-full h-screen justify-center items-center">
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

        {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
      </div>
    </div>
  )
}

