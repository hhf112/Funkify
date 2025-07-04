import { Route, Routes } from "react-router-dom"
import { Login } from "./LoginPage/Login"
import { Home } from "./Home";
import { ProblemPage } from "./ProblemPage/Problem.js";
import { sessionContext } from "./contexts/SessionContextProvider";
import { useContext, useEffect } from "react";


function App() {
  const { user, getSessionToken } = useContext(sessionContext);

  useEffect(() => {
    if (user.isValid) {
      getSessionToken();
    }
  }, [user.isValid]);


  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Problem/:Id" element={<ProblemPage />} />
        <Route path="/" element={<Home />} />
      </Routes>

    </>
  )
}

export default App
