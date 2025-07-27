import { Route, Routes } from "react-router-dom"
import { Auth } from "./AuthPage/Auth"
import { Home } from "./Home";
import { Problem } from "./ProblemPage/Problem";
import { User } from "./User";
import { Problems } from "./Problems";


function App() {

  return (
    <>
      <Routes>
        <Route path="/Login" element={<Auth />} />
        <Route path="/Problem/:Id" element={<Problem />} />
        <Route path="/" element={<Home />} />
        <Route path="/User" element={<User />} />
        <Route path="/Problems" element={<Problems />} />
      </Routes>

    </>
  )
}

export default App
