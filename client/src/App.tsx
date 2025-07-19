import { Route, Routes } from "react-router-dom"
import { Login } from "./LoginPage/Login"
import { Home } from "./Home";
import { ProblemPage } from "./ProblemPage/Problem";
import { User } from "./User.js";
import { Problems } from "./Problems";


function App() {

  return (
    <>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Problem/:Id" element={<ProblemPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/problems" element={<Problems />} />
      </Routes>

    </>
  )
}

export default App
