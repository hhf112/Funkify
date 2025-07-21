import { type problem } from "../contexts/SessionContextProvider"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useEffect } from "react";


function DifficultyTag({ attr, color }: { attr: string, color: string }) {
  const diff_colors: Record<string, string> = {
    green: "mx-2  text-white bg-green-500 p-10",
    red: "mx-2  text-white bg-red-500 p-10",
    amber: "mx-2  text-white bg-amber-500 p-10",
  }
  return (
    <span className={` ${diff_colors[color]} px-5 py-2 m-2 font-semibold rounded-xl shadow`}>
      {attr}
    </span>
  )
}


export function PageLeftProblem({ problem }: { problem: problem }) {


  return (
    <div className="p-3">
      {/* Title */}
      <h1 className="text-3xl font-bold my-2"> {problem?.title} </h1>


      {/* Additional Info */}
      <div className="flex justify-between not-prose items-center">
        {/* Diffuculty */}
        <div className="my-4 text-sm">
          {problem?.difficulty == "Easy" && <DifficultyTag attr="Easy" color="green" />}
          {problem?.difficulty == "Medium" && <DifficultyTag attr="Medium" color="amber" />}
          {problem?.difficulty == "Hard" && <DifficultyTag attr="Hard" color="red" />}
        </div>

      {/* Tags */}
        <div className="flex items-center overflow-x-auto">
          <div className="w-5 h-5 mr-1 " >
            <img src="/tag.png" className="block my-0 w-fit h-fit" />
          </div>
          {problem?.tags.map((tag, index) => {
            return <div key={index}
              className="text-sm mr-1 text-neutral-700 rounded-full border border-neutral-200 px-2 py-2" >
              {tag}
            </div>
          })}
        </div>

      </div>


      {/* Description */}
      <Markdown children={problem?.description} remarkPlugins={[remarkGfm]} />
    </div>
  )
}
