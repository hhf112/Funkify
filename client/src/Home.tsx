import {  useNavigate } from "react-router-dom"

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1> Homepage, currently under development </h1>
      <ul className="list-disc">
        <li className="cursor-pointer" onClick={() => navigate("/Login")}> Login </li>
        <li className="cursor-pointer" onClick={() => navigate("/Problem/:Id")}> Problem/:Id </li>
      </ul>
    </div>
  )


}
