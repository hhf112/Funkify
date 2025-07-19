import { type problem } from "../contexts/SessionContextProvider"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"


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
    <div className="prose ">
      {/* Title */}
      <h1 className="text-3xl font-bold my-2"> {problem?.title} </h1>

      {/* Diffuculty */}
      <div className="my-4 text-sm">
        {problem?.difficulty == "Easy" && <DifficultyTag attr="Easy" color="green" />}
        {problem?.difficulty == "Medium" && <DifficultyTag attr="Medium" color="amber" />}
        {problem?.difficulty == "Hard" && <DifficultyTag attr="Hard" color="red" />}
      </div>

      {/* Description */}
      <Markdown children={problem?.description} remarkPlugins={[remarkGfm]} />

      {/* Tags 
      <div className="">
        {problem?.tags.map((tag, index) => {
          return <div key={index}
            className="flex max-w-20 justify-center items-center 
            bg-neutral-900 text-neutral-50 hover:-translate-y-1 hover:bg-blue-400 border-neutral-900  cursor-pointer
                       px-2 py-2  mx-1 transition delay-75"
          >
            <img src="/tag.png" className = "w-1/6 h-full object-cover"/>
            {tag}
          </div>
        })
        }
      </div>
      */}
    </div>
  )
}
