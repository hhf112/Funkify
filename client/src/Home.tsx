import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { sessionContext } from "./contexts/SessionContextProvider.tsx";
import { setUncaughtExceptionCaptureCallback } from "process";
import { Disclaimer } from "./AuthPage/components.tsx";

const authentication = import.meta.env.VITE_AUTH;
const backend = import.meta.env.VITE_BACKEND;
const compiler = import.meta.env.VITE_COMPILER;

function NavBarButton({ navigateTo, title, hoverClass }: {
    navigateTo: string,
    title: string
    hoverClass: string
}) {
    const navigate = useNavigate();
    return <div className={`px-5 cursor-pointer py-3 mx-2 border-4 border-neutral-800 rounded-full  font-semibold 
          bg-white  ${hoverClass} hover:translate-y-1  hover:text-white hover:scale-105 hover:shadow-2xl  
          transition-all delay-75`}
        onClick={() => navigate(navigateTo)}>
        <h1>
            {title}
        </h1>
    </div>
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


    // useEffect(() => {
    // if (!authentication || !backend || !compiler) {
    //     navigate("/Down");
    //     return;
    //   }
    //
    //   (async () => {
    //     try{ 
    //     const ping1 = await fetch(backend);
    //     const ping2 = await fetch(authentication);
    //     const ping3 = await fetch(compiler);
    //     if (!ping1.ok || !ping2.ok || !ping3.ok) {
    //         navigate("/Down");
    //       }
    //     } catch (err) {
    //       navigate("/Down");
    //     }
    //   }) ();
    // }, [])


    useEffect(() => {
        let checkLogin = async () => {
            try {
                setErrMsg({ message: "detecting past logins", color: "amber" });
                const tryLogin = await fetch(`${authentication}/token`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    credentials: "include",
                });
                if (tryLogin.ok) {
                    setErrMsg({ message: "Login found!", color: "green" });
                    setTimeout(() => setErrMsg({ message: "", color: "" }), 3000);
                    const tryLoginJSON = await tryLogin.json();
                    const { user, accessToken } = tryLoginJSON;
                    setSessionToken(accessToken);
                    setUser(user);
                    return;
                }

                setErrMsg({ message: "", color: "green" });
            } catch (err) {
                setErrMsg({ message: "unexpected error occured", color: "red" });
                console.error(err);
            }
        }

        checkLogin();
    }, [])

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
                }, 2000);
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
            }, 400);
        }, 500)

        return () => clearInterval(interval);
    }, [])

    /* component */
    return (
        <div className="py-5 px-40 h-screen items-center w-full flex flex-col bg-white">

            {/* HEADER */}
            <div className="text-black items-center text-xl font-Inter flex justify-center scale-110 w-full  p-3  rounded-xl">
                {sessionToken ?
                    <NavBarButton navigateTo="" title={"Hi " + user?.username + "!"} hoverClass="hover:bg-cyan-500" />
                    :
                    <NavBarButton navigateTo="/Login" title="Login/SignUp" hoverClass="hover:bg-cyan-500" />
                }

                <NavBarButton navigateTo="/Problems" title="Problems" hoverClass="hover:bg-amber-500" />
                <NavBarButton navigateTo="/Problems" title="About this website" hoverClass="hover:bg-amber-500" />
            </div>

            {/* BODY */}
            <div className="flex justify-between gap-4 w-full h-full  p-10">

                {/*LEFT*/}
                <div className=" font-Inter h-full w-full font-bold flex-1  flex flex-col justify-center">
                    <div className="text-7xl font-mono ">
                        <h1
                            className={` inline-block px-2 ${mount[0] ? "text-white  bg-neutral-900 translate-x-2 italic delay-200" : "delay 75"}
              ${doneMount && "font-Inter p-2 rounded text-white bg-cyan-500"}
              hover:text-amber-100  hover:bg-neutral-900  hover:translate-y-2  hover:italic
              transition`}>
                            {doneMount ? "Funkify." : "Think."}
                        </h1>
                        <br />
                        <h1
                            className={`
              inline-block px-2
              ${mount[1] ? "text-white  bg-cyan-500  -translate-y-2 scale-90 delay-200" : "delay 75"}
              hover:text-white  hover:font-mono hover:bg-neutral-900  hover:translate-y-2  hover:italic
              transition`}>
                            {doneMount ? "THE." : "Code."}
                        </h1>
                        <br />
                        <h1
                            className={`
              inline-block px-2
              ${mount[2] ? "text-black bg-yellow-400  translate-y-2 scale-120 delay-200 shadow-2xl shadow-cyan-400" : "delay 75"} 
hover:text-white  hover:bg-black   hover:translate-y-2  hover:italic transition`}>
                            {doneMount ? "ONLINE JUDGE." : "Win."}
                        </h1>
                        <div>
                            <p className="my-6 px-2 hover:scale-105 transition delay-100 font-mono font-semibold text-lg  text-neutral-500">

                                Compete amongst a community of problem solvers ..
                            </p>
                            <button
                                onClick={() => navigate("/Problems")}
                                onMouseOver={() => setHoverCheckout(true)}
                                onMouseLeave={() => setHoverCheckout(false)}
                                className={`my-3  p-5  border-4 text-white bg-amber-500 text-xl cursor-pointer font-mono font-semibold 
                                 hover:shadow-xl hover:font-bold shadow-lg shadow-neutral-500 border-amber-500 ${doneMount && "animate-pulse"}
                                    hover:text-white  hover:bg-neutral-600 hover:border-neutral-600 transition delay-75`}>
                                Join The Stage
                                {hoverCheckout ?
                                    <img src="/home-next-dark.png" className=" mx-5 h-8 inline-block" />
                                    :
                                    <img src="/home-next-white.png" className=" mx-5 h-8 inline-block" />
                                }
                            </button>
                        </div>
                    </div>
                </div >

                {/* RIGHT */}
                <div className="flex-1 w-full h-full p-4  flex items-center justify-center ">
                    <img src="/cube.jpg" alt="banner" className="shadow-neutral-500 shadow-xl max-h-full max-w-full scale-80
            rounded-full object-contain "
                    />
                </div>
            </div>
            {errMsg.message.length !== 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
        </div>
    )
}


