import { Route, Routes } from "react-router-dom"
import { Auth } from "./AuthPage/Auth"
import { Home } from "./Home";
import { ProblemPage } from "./ProblemPage/Problem";
import { User } from "./User";
import { Problems } from "./Problems";


function App() {

  return (
    <>
      <Routes>
        <Route path="/Login" element={<Auth />} />
        <Route path="/Problem/:Id" element={<ProblemPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/problems" element={<Problems />} />
      </Routes>

    </>
  )
}

export default App
