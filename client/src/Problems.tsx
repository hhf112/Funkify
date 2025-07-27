import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sessionContext } from "./contexts/SessionContextProvider";
import { diff } from "util";
import { AddProblem } from "./AddProblem";
import { preview } from "vite";
import { Disclaimer } from "./AuthPage/components";

interface ProblemCompact {
  title: string,
  difficulty: string,
  tags: string[],
  _id: string,
}

const backend = import.meta.env.VITE_BACKEND;
if (!backend) {
  console.error("backend url not found")
  process.exit(1);
}

function getColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500"
    case "Hard":
      return "bg-red-500"
    case "Medium":
      return "bg-amber-500"
    default:
      return "bg-black"
  }
}

function ProblemCard({ prob, status }: { prob: ProblemCompact, status: string }) {
  const [mount, setMount] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => setMount(true), []);

  return (
    <div className={`border border-neutral-200 rounded-lg p-3 mx-4 my-2 shadow-xs
                      flex flex-col cursor-pointer
        ${mount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} transform duration-300
              hover:scale-95 hover:shadow-cyan-200
              transition delay-100`}
      onClick={() => navigate(`/Problem/${prob._id}`)}>
      <div className="flex">
        <p className="my-2">
          {prob.title}
        </p>
        <img src="/" />
      </div>

      <div className="flex justify-between gap-5">
        <p className={`rounded-lg px-3 py-2 shadow text-sm
        ${getColor(prob.difficulty)} text-white`}>
          {prob.difficulty}
        </p>

        <div className="flex items-center">
          <img src="/tag.png" className="h-5 w-5 mx-2" />
          {prob.tags.map((tag: any, index: number) =>
            <p
              className="p-2 border border-neutral-300 text-xs rounded-full"
              key={index}>
              {tag}
            </p>
          )}
        </div>

      </div>

    </div>
  )

}

export function Problems() {
  /* states */
  const { sessionToken, user } = useContext(sessionContext);
  const [hoverAddProblem, setHoverAddProblemm] = useState<boolean>(false);
  const [addProblemWindow, setAddProblemWindow] = useState<boolean>(false);
  const [problems, seteProblems] = useState<ProblemCompact[]>([]);
  const [mount, setMount] = useState<boolean[]>([false, false]);
  const navigate = useNavigate();
  const location = useLocation();
  const previous = location?.state?.previous || '/';

  useEffect(() => {
    setMount([true, false]);
    setTimeout(() => setMount([true, true]), 3000)
    const getProbs = async () => {
      try {
        const get = await fetch(`${backend}/api/problems/count?count=10`);
        const getJSON = await get.json();
        if (getJSON.problems) seteProblems(getJSON.problems);
      } catch (err) {
        console.log(err);
      }
    }
    getProbs();
  }, [])


  // console.log(sessionToken);
  /* component */
  return (
    <div className="py-5  h-screen items-center w-full flex flex-col">

      <h1 className="fixed top-0 left-0 p-2 text-cyan-500 font-bold font-Inter bg-white/20
        backdrop-blur-xs w-full tex-sm h-5">
        Funkify
      </h1>



      <button
        className={`px-20 cursor-pointer py-3 mx-2 border-4 border-neutral-700 
          rounded-full  font-semibold text-xl font-Inter
          hover:bg-yellow-400 hover:-translate-x-5 hover:text-black  hover:shadow-2xl  
          transition-all delay-200 flex justify-between gap-4 items-center`}
        onClick={() => navigate(previous)}>
        <p> Go back </p>
        <img src="/back.png" className="h-5 w-5" />
      </button>

      <div className="w-full flex flex-col  px-40 my-5">

        <div className="my-5 flex justify-between items-center w-full px-10">
          <h1 className={`font-Inter font-semibold text-3xl text-neutral-600 transform
${mount[0] ? "opacity-100 translate-y-0 scale-100" : "scale-90 translate-y-2 opacity-0"} transition-all delay-100  duration-500`}>
            {
              sessionToken.length ?
                hoverAddProblem ? "Contribute a problem!" : `Hi ${user.username}! Challenge yourself everyday!`
                :
                hoverAddProblem ? "Create an account to contribute problems!" : "Create an account today to start solving!"
            }
          </h1>

          <button
            className={`px-20 cursor-pointer py-3 mx-2 border-4 border-neutral-700 
          rounded-full  font-semibold text-xl font-Inter
          hover:bg-green-500  hover:scale-105 hover:translate-y-2 hover:text-white  hover:shadow-2xl  
          transition-all delay-200`}
            onMouseOver={() => setHoverAddProblemm(true)}
            onMouseOut={() => setHoverAddProblemm(false)}
            onClick={() => {
              if (!sessionToken) navigate("/Login", {
                state: {
                  previous: "/Problems",
                }
              });
              setAddProblemWindow(true)
            }}>
            +
          </button>
        </div>

        {
          !problems.length ?
            <Disclaimer display="Fetching problems" colorClass="amber" />
            :
            problems.map((prob, index) => <ProblemCard key={index} prob={prob} />)
        }

        {addProblemWindow && <AddProblem setAddProblemWindow={setAddProblemWindow} />}

      </div>

    </div>
  )
}
