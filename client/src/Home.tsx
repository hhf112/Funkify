import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { sessionContext } from "./contexts/SessionContextProvider";
import { setUncaughtExceptionCaptureCallback } from "process";
import { Disclaimer } from "./AuthPage/components";



const authentication = import.meta.env.VITE_AUTH;
if (!authentication) {
  console.error("authentication not provided");
}

export function Home() {
  /* states */
  const navigate = useNavigate();
  const { sessionToken, setSessionToken, user, setUser } = useContext(sessionContext);
  const [hoverCheckout, setHoverCheckout] = useState<boolean>(false);
  const [hoverCreateAccount, setHoverCreateAccount] = useState<boolean>(false);
  const [mount, setMount] = useState<boolean[]>([false, false, false]);
  const [doneMount, setDoneMount] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<{ message: string, color: string }>({ message: "", color: "" });

  /* effect */

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
        if (!getJSON.accessToken) {
          setErrMsg({message: "", color: ""});
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

  // useEffect(() => console.log(user), [user.isValid]);

  let flag = 0;
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = flag;
      flag++;
      if (idx == 3) {
        setMount([true, true, true]);
        setHoverCheckout(true);
        setTimeout(() => {
          setMount([false, false, false]);
          setHoverCheckout(false);
          setDoneMount(true);
          setHoverCreateAccount(true);
          setTimeout(() => {
            setHoverCreateAccount(false);
          }, 2000)
        }, 3000);
        return;
      }

      if (idx == 4) {
        clearInterval(interval);
        return;
      }
      setMount(prev => {
        const cp = [...prev];
        cp[idx] = true;
        return cp;
      });
      setTimeout(() => {
        setMount(prev => {
          const cp = [...prev];
          cp[idx] = false;
          return cp;
        });
      }, 500);
    }, 600)

    return () => clearInterval(interval);
  }, [])

  /* component */
  return (
    <div className="py-5 px-40 h-screen items-center w-full flex flex-col">

      {/* NAVBAR */}
      <h1 className="fixed top-0 left-0 p-2 text-cyan-500 font-bold font-Inter bg-white/20
        backdrop-blur-xs w-full tex-sm h-5">
        Funkify
      </h1>

      {/* HEADER */}
      <div className="text-neutral-700 items-center text-xl font-Inter flex justify-center">
        {sessionToken ?
          <h1
            className={`px-4 cursor-pointer py-3 mx-2 border-4 border-neutral-700 
          rounded-full  font-semibold 
  ${hoverCreateAccount && "translate-y-1 text-white scale-105 shadow-2xl bg-cyan-500"}
          hover:bg-cyan-500 hover:translate-y-1 hover:text-white hover:scale-105 hover:shadow-2xl  
          transition-all delay-200`}
            onClick={() => navigate("/user")}>
            Hi {user.username}! 👋
          </h1>
          :
          <h1
            className={`px-4 cursor-pointer py-3 mx-2 border-4 border-neutral-700 
          rounded-full  font-semibold 
  ${hoverCreateAccount && "translate-y-1 text-white scale-105 shadow-2xl bg-cyan-500"}
          hover:bg-cyan-500 hover:translate-y-1 hover:text-white hover:scale-105 hover:shadow-2xl  
          transition-all delay-200`}
            onClick={() => navigate("/Login")}>
            Create an Account/Login
          </h1>
        }

        <h1
          className={`px-4 cursor-pointer py-3 mx-2 border-4 border-neutral-700 
          rounded-full  font-semibold 
          hover:bg-green-500 hover:translate-y-1 hover:text-white hover:scale-105 hover:shadow-2xl  
          transition-all delay-200`}
          onClick={() => navigate("/Problems")}>
          Problems
        </h1>


        <h1
          className="px-4 cursor-pointer 
          rounded-full hover:bg-yellow-300 font-semibold 
              hover:translate-y-1  hover:scroll-m-2
          hover:scale-105 transition-all delay-200 hover:shadow-2xl  
          py-3 mx-2 border-4 border-neutral-700 "
          onClick={() => navigate("/Problems")}>
          About us
        </h1>
      </div>

      <div className="flex justify-between gap-4 w-full max-h-full">

        {/*LARGE TEXT*/}
        <div className=" font-Inter max-h-full font-bold  my-15 flex-1 ">
          <div className="text-7xl my-3 mb-5 font-mono">
            <h1
              className={`
              inline-block px-2
              ${mount[0] ? "text-white  bg-neutral-900 translate-x-2 italic delay-200" : "delay 75"}
              ${doneMount && "font-Inter p-2 rounded text-cyan-500 bg-yellow-400"}
              hover:text-amber-100  hover:bg-neutral-900  hover:translate-y-2  hover:italic
              transition`}>
              {doneMount ? "Funkify." : "Code."}
            </h1>
            <br />
            <h1
              className={`
              inline-block px-2
              ${mount[1] ? "text-white  bg-cyan-500  -translate-y-2 scale-90 delay-200" : "delay 75"}
              hover:text-white  hover:font-mono hover:bg-neutral-900  hover:translate-y-2  hover:italic
              transition`}>
              {doneMount ? "THE." : "Submit."}
            </h1>
            <br />
            <h1
              className={`
              inline-block px-2
              ${mount[2] ? "text-black bg-yellow-400  translate-y-2 scale-120 delay-200 shadow-2xl shadow-cyan-400" : "delay 75"} 
hover:text-white  hover:bg-black   hover:translate-y-2  hover:italic transition`}>
              {doneMount ? "ONLINE JUDGE." : "Win."}
            </h1>
          </div>
          <p className="my-6 px-2 hover:scale-105 transition delay-100 font-normal text-lg  text-neutral-500">
            "Solve real coding challenges, sharpen your skills, and climb the leaderboard — all in one place
          </p>
          <button
            onClick={() => navigate("/Problems")}
            onMouseOver={() => setHoverCheckout(true)}
            onMouseLeave={() => setHoverCheckout(false)}
            className={`my-3 rounded-full p-5  border-4   text-neutral-700
          bg-cyan-400 text-lg cursor-pointer font-sans font-bold 
             hover:shadow-xl shadow-lg shadow-neutral-500 border-neutral-700 
            ${hoverCheckout ? "bg-cyan-500 border-neutral-900 text-white translate-x-4 scale-105 italic" : ""}
            ${doneMount && "animate-bounce"}
            hover:bg-cyan-500 hover:border-neutral-900 hover:text-white
            hover:translate-x-4 hover:scale-105 hover:italic
            transition delay-150`}>
            CHECKOUT
            {hoverCheckout ?
              <img src="/home-next-dark.png" className=" mx-5 h-8 inline-block" />
              :
              <img src="/home-next-white.png" className=" mx-5 h-8 inline-block" />
            }
          </button>
        </div >

        {/* BANNER IMAGE*/}
        {/*<div className="flex-1 max-w-full max-h-full border"> </div>*/}

        <div className="flex-1 max-w-full max-h-full flex items-center justify-center ">
          <img
            src="/landing.png"
            alt="banner"
            className="max-h-full max-w-full 
            rounded-xl object-contain "
          />
        </div>
      </div>
      <p className="relative top-50"> TM </p>

      {errMsg.message.length !== 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
    </div>
  )
}


