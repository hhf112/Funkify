import React, { useContext, useEffect, useState } from "react"
import { sessionContext } from "./contexts/SessionContextProvider"
import { useNavigate, useNavigation } from "react-router-dom";
import { Disclaimer } from "./AuthPage/components";

export function User() {

  /* use */
  const { Logout, user } = useContext(sessionContext);
  const navigate = useNavigate();
  const [mount, setMount] = useState(false);
  const [errMsg, setErrMsg] = useState({
    message: "",
    color: "amber",
  });
  // navigate("/Login");


  useEffect(() => setMount(true), [])


  /* component */
  return (
    <div className="flex  h-screen flex-col justify-begin py-20 px-40 items-center">
      <button
        className="fixed top-0 p-4 border rounded-xl border-neutral-400 cursor-pointer"
      onClick={async ()=> {
          setErrMsg({message: "Logging you out..." , color: "amber"});
          await Logout();
          setErrMsg({message: "" , color: "amber"});
          navigate("/");
        }}> 
        Logout
      </button>

      {/* profile card and  problem stats*/}
      <div className={`h-1/3  w-full flex justify-between gap-1`}>

        {/* profile card */}
        <div className="p-2 flex flex-2 justify-between items-center gap-4 
          h-full w-1/2 rounded-xl shadow border-neutral-300 border">

          <div className="h-32 w-32 mx-10">
            <img src="/landing.png" className="h-full w-full rounded-full border-4 border-gray-300 object-cover" />
          </div>

          <div className="grow ">
            <div className="p-4 min-w-full">
              <h1 className="text-5xl font-Inter font-bold my-1">
                {user?.username}
              </h1>

              <div className="flex items-center mt-5">

                <div className="w-5 h-5 mr-1">
                  <img src="/email.png" className="opacity-80 w-full h-full" />
                </div>

                <h3 className="ml-1 text-sm font-normal">
                  {user?.email}
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* problen states*/}
        <div
          className="m-0.5 py-10 flex flex-col items-center 
          rounded-xl flex-1 border border-neutral-300 shadow">

          <div className="flex w-full justify-center border h-full font-bold text-neutral-500 text-lg">
            <h1> Problems solved: {3123} </h1>
          </div>
        </div>

      </div>


      {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color}/>}
    </div>

  )
}
