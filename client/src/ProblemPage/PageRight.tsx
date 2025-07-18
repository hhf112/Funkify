import * as monaco from "monaco-editor"
import Editor from "@monaco-editor/react";
import { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { problem } from "../contexts/SessionContextProvider.js";


const defaultEditorCpp: string = `#include <bits/stdc++.h>
using namespace std;
int main(){

return 0; 
}
`
export function PageRight({
  editorRef,
  sampleTests,
  setSampleTests,
}: {
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>
  sampleTests: { input: string, output: string }[],
  setSampleTests: Dispatch<SetStateAction<{ input: string, output: string, }[]>>,
  prob: problem | null
}) {
  const [sampleTestView, setSampleTestView] = useState<number>(0);

  useEffect(() => {
    // setSampleTestView(sampleTests.length - 1);
  }, [sampleTests.length]);


  /* Component */
  return (
    <div className="flex-4 flex flex-col justify-between gap-2 h-full">

      {/* EDITOR */}
      <div className="flex flex-col min-h-0 flex-2 mx-1">
        <div className="rounded-lg bg-white flex-1 min-h-0  p-2 my-1 text-neutral-900 border-neutral-400 border">
          Select a language
        </div>
        <div className=" bg-black flex-13 min-h-0">
          <Editor
            onMount={(editor, _) => {
              editorRef.current = editor;
            }}
            options={{
              lineNumbers: "on",
              minimap: { enabled: false },
            }}
            height="100%" width="100%"
            defaultLanguage="cpp"
            defaultValue={defaultEditorCpp}
            theme="vs-dark"
          />
        </div>
      </div>


      <div className="flex-1 min-h-0 flex flex-col bg-white 
        border-neutral-400 border shadow-lg 
        shadow-neutral-400">
        <div className="flex w-full bg-neutral-200 overflow-auto">
          {sampleTests.map((_, index: number) => {
            return (
              <div key={index.toString()}
                className={`${sampleTestView == index ? "bg-white text-neutral-800" :
                  "bg-neutral-900 text-neutral-50"}
                       shrink-0 px-10 py-2 border-neutral-200 mx-1 cursor-auto `}
                onMouseOver={() => setSampleTestView(index)}>
                Test {index}
              </div>
            )
          })}

          <div
            onClick={() => {
              setSampleTests((tests: { input: string, output: string, }[]) => [...tests, { input: " ", output: " " }])
            }}
            className="text-xl text-white bg-neutral-900 border-neutral-900
          hover:-translate-y-1 hover:bg-blue-400
                px-10 py-2  mx-1 transition delay-75 cursor-pointer"
          >
            +
          </div>
        </div>


        {sampleTests.length != 0 &&
          <div className="bg-white text-neutral-800 grow py-1 px-1 flex items-stretch m-2  h-full">
            <div className="grow-1 flex flex-col m-1 h-full">
              <h3 className="text-xs text-neutral-400 font-bold my-0.5 flex-1">Input </h3>
              <textarea
                className="border border-neutral-300 resize-none w-full flex-7 px-1"
                value={sampleTests[sampleTestView].input}
                onChange={(e) => {
                  setSampleTests((prev: { input: string, output: string }[]) => {
                    const new_tests = [...prev];
                    new_tests[sampleTestView].input = e.target.value;
                    return new_tests;
                  })
                }} />
            </div>

            <div className="grow-1 flex flex-col m-1 h-full">
              <h3 className="text-xs text-neutral-400 font-bold my-0.5 flex-1">Output </h3>
              <textarea
                className="border border-neutral-300 resize-none w-full flex-7 px-1"
                value={sampleTests[sampleTestView].output}
                onChange={(e) => {
                  setSampleTests((prev: { input: string, output: string }[]) => {
                    const new_tests = [...prev];
                    new_tests[sampleTestView].output = e.target.value;
                    return new_tests;
                  })
                }} />
            </div>
          </div>
        }
      </div >
    </div >
  )
}
