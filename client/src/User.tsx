import React, { useContext } from "react"
import { sessionContext } from "./contexts/SessionContextProvider"
import { useNavigate, useNavigation } from "react-router-dom";

export function User() {
  const { Logout } = useContext(sessionContext);
  const navigate = useNavigate();
  return (
    <div className="flex bg-neutral-900 h-screen flex-col justify-center items-center">

      <h1 className="fixed top-0 left-0 p-2 text-cyan-500 font-bold font-Inter bg-white/20
        backdrop-blur-xs w-full tex-sm h-5 cursor-pointer"
        onClick={() => {
          Logout();
          navigate("/Login");
        }}>
        user
      </h1>
    </div>
  )
}
