import { generatePath, Route, Routes } from "react-router-dom"
import { Login } from "./Login"
import { Home } from "./Home";
import { Problem } from "./Problem";
import { sessionContext, type sessionContextType } from "./contexts/SessionContextProvider";
import { useContext, useEffect } from "react";


function App() {
  const { user, sessionToken, getSessionToken } = useContext(sessionContext);


  useEffect(() => {
    if (user.isValid) {
      getSessionToken();
    }
  }, [user.isValid]);

  if (import.meta.env.VITE_ENV === "dev") {
    useEffect(() => {
      if (sessionToken != "") {
        console.log("user in session.");
      }
    }, [sessionToken])
  }

  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Problem/:Id" element={<Problem />} />
        <Route path="/" element={<Home />} />
      </Routes>

    </>
  )
}

export default App
