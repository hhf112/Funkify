import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const backend = import.meta.env.VITE_BACKEND;
if (!backend) {
  console.error("backend url not found")
  process.exit(1);
}

export function Problems() {
  /* States */
  const [problems, seteProblems] = useState<any[]>([]);
  const [mount, setMount] = useState<boolean[]>([false, false]);
  const navigate = useNavigate();

  useEffect(() => {
    setMount([true, false]);
    setTimeout(()=> setMount([true, true]), 3000)
    const getProbs = async () => {
      try {
        const get = await fetch(`${backend}/api/problems/count?count=10`);
        const getJSON = await get.json();
        console.log(getJSON.problems);
        seteProblems(getJSON.problems);
      } catch (err) {
        console.log(err);
      }
    }
    getProbs();
  }, [])

  return (
    <div className="py-5  h-screen items-center w-full flex flex-col">

      <h1 className="fixed top-0 left-0 p-2 text-cyan-500 font-bold font-Inter bg-white/20
        backdrop-blur-xs w-full tex-sm h-5">
        Funkify
      </h1>


      <div className="w-full flex flex-col px-40 my-5">
        {!problems.length ?
          <h1 className="font-mono animate-pulse"> LOADING... </h1>
          :
          problems.map((prob, index) => {
            return (
              <div className="border border-neutral-200 rounded-lg p-5 mx-4 my-2 shadow-xs
              flex flex-col cursor-pointer
              hover:scale-95 hover:shadow-cyan-200
              transition delay-75"
                onClick={() => navigate(`/Problem/${prob._id}`)}
                key={index.toString()}>
                <p className="my-2">
                  {prob.title}
                </p>

                <div className="flex justify-between gap-5">
                  <p className="rounded-lg px-3 py-2 border border-neutral-300 text-sm">
                    {prob.difficulty}
                  </p>

                  <div> {prob.tags.map((tag: any, index: number) =>
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
          })}
      </div>
    </div>
  )
}
