import { type problem } from "./contexts/SessionContextProvider"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"


function DifficultyTag({ attr, color }: { attr: string, color: string }) {
  const diff_colors: Record<string, string> = {
    green: "border-green-500 mx-2 rounded-lg text-green-200 bg-green-900",
    red: "border-red-500 mx-2 rounded-lg text-red-200 bg-red-900",
    amber: "border-amber-500 mx-2 rounded-lg text-amber-200 bg-amber-900",
  }
  return (
    <span className={`border ${diff_colors[color]} px-2 py-1 m-2`}>
      {attr}
    </span>
  )
}

export function ProblemContents({ problem }: { problem: problem }) {
  return (
    <>
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

      {/* Tags */}
      {problem?.tags &&
        (
          problem?.tags.map((tag, index) => {
            return
            <span className="flex max-w-20 justify-center items-center 
                        rounded-xl bg-neutral-900 py-2 px-1 m-2 text-blue-50 
                border border-neutral-500" key={index} >
              <img src="/tag.png" className="w-3 h-3 mx-1" />
              {tag}
            </span>
          })
        )
      }
    </>
  )
}
