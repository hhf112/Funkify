import { Route, Routes } from "react-router-dom"
import { Auth } from "./AuthPage/Auth"
import { Home } from "./Home";
import { Problem } from "./ProblemPage/Problem";
// import { User } from "./User";
import { Problems } from "./Problems";
import { useContext, useEffect, useState } from "react";
import { sessionContext } from "./contexts/SessionContextProvider";
import { Down } from "./Down";



const authentication = import.meta.env.VITE_AUTH;

function App() {
  const { setUser, sessionToken, setSessionToken } = useContext(sessionContext);

  useEffect(() => {
    (async () => {
      try {
        const tryLogin = await fetch(`${authentication}/token`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        });
        if (tryLogin.ok) {
          const tryLoginJSON = await tryLogin.json();
          const { user, accessToken } = tryLoginJSON;
          setSessionToken(accessToken);
          setUser(user);
          return;
        }
      } catch (err) {
        console.error(err);
      }

    })();
  }, [])

  // useEffect(() => console.log(sessionToken), [sessionToken]);



  return (
    <Routes>
      <Route path="/Login" element={<Auth />} />
      <Route path="/Problem/:Id" element={<Problem />} />
      <Route path="/" element={<Home />} />
      <Route path="/Problems" element={<Problems />} />
      <Route path="/Down" element={<Down/>} />
    </Routes>
  )
}

export default App
