import { type problem } from "./contexts/SessionContextProvider"

export function ProblemContents({ problem }: { problem: problem }) {
  return (
    <>
      {/* Title */}
      <h1 className="text-3xl font-bold my-2"> {problem?.title} </h1>


      {/*Info */}
      <div className="my-4 text-sm">
        {/*Diffuculty*/}
        {problem?.difficulty == "Easy" &&
          <span className="border border-green-500 mx-2 rounded-lg text-green-200 bg-green-900 px-2 py-1 m-2">
            Easy
          </span>
        }
        {problem?.difficulty == "Medium" &&
          <span className="border border-amber-500 mx-2 rounded-lg text-amber-200 bg-amber-900 px-2 py-1 m-2">
            Medium
          </span>
        }
        {problem?.difficulty == "Hard" &&
          <span className="border border-red-500 mx-2 rounded-lg text-red-200 bg-red-900 px-2 py-1 m-2">
            Hard
          </span>
        }
      </div>

      {/*Desc*/}
      {problem?.description.split("\n").map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}

      {/* Tags */}
      {problem?.tags &&
        (
          problem?.tags.map((tag, index) => {
            return (
              <>
                <span className="flex max-w-20 justify-center items-center 
                        rounded-xl bg-neutral-900 py-2 px-1 m-2 text-blue-50 border
                        border-neutral-500" key={index} >
                  <img src="/tag.png" className="w-3 h-3 mx-1" />
                  {tag}
                </span>
              </>
            )
          })
        )
      }
    </>

  )
}
