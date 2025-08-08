import type { Dispatch, SetStateAction } from "react"
import type { testResult } from "./types"
import { VerdictCard } from "./components"

export function PageLeftRun({
  runVerdict,
  setRunVerdict,
  setContent
}: {
  setContent: Dispatch<SetStateAction<number>>
  runVerdict: { finalVerdict: string, results: testResult[] } | null,
  setRunVerdict: Dispatch<SetStateAction<{
    finalVerdict: string,
    results: testResult[],
  } | null>>

}) {
  // console.log(runVerdict?.results);

  return (
    <div className="h-full w-full  flex flex-col items-center p-5 overflow-y-auto">
      <button onClick={() => setContent(0)}
        className="cursor-pointer hover:bg-neutral-200 p-2 rounded-xl hover:-translate-x-2 transition delay-75 
        flex justify-between gap-1 items-center min-w-0 h-8 m-2">
        <p className="align-middle"> Back to problem </p>
        <img src="/left-arrow.png" className="shrink-0 object-contain p-1 h-8 w-8" />
      </button>

      {!runVerdict ?
        <div className="p-10 text-lg prose prose-sm bg-neutral-100 animate-pulse w-full">
          <h1 className="text-white text-center"> Waiting </h1>
        </div>
        : <VerdictCard key={runVerdict === null ? 1 : 0 } message={runVerdict.finalVerdict} />
      }

      {runVerdict?.results.map((test, index) => (
        <div key={index.toString()}
          className="text-lg font-mono max-h-none border flex flex-col my-4 p-2 w-full
          border-neutral-400">
          <span
            className={`${test.verdict.passed ? "bg-green-400 " : "bg-red-400"}
              text-white p-1`}>
            TEST {index}
          </span>
          { test.test  ? <div className="flex flex-col">
            INPUT
            <textarea readOnly={true}
              className="  border-neutral-400 resize-y border grow overflow-y-auto p-1"
              defaultValue={test.test.input} />
            OUTPUT
            <textarea readOnly={true}
              className="   border-neutral-400 resize-y grow border overflow-y-auto p-1"
              defaultValue={test.output} />
            EXPECTED
            <textarea readOnly={true}
              className="   border-neutral-400 resize-y grow border overflow-y-auto p-1"
              defaultValue={test.test.output} />
          </div> : <div className="flex flex-col">
            STDERR
            <textarea readOnly={true}
              className="  border-neutral-400  text-red-400 resize-y border grow overflow-y-auto p-1"
              defaultValue={test.error?.stderr} />
              ERROR
            <textarea readOnly={true}
              className="  border-neutral-400 text-red-400 resize-y border grow overflow-y-auto p-1"
              defaultValue={test.error?.error} />
          </div>}
        </div>
      ))}
    </div>

  )
}

