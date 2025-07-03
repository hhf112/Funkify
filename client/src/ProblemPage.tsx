import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { sessionContext, type problem } from "./contexts/SessionContextProvider";
import { ProblemContents } from "./ProblemContents";

import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor"
const backend: string = import.meta.env.VITE_BACKEND || "";



export interface Submission {
  problemId: string,
  userId: string,
  code: string,
  submissionTime?: Date,
  language: string
  status: string | "pending",
  verdictId: string | null,
}

async function getProblemOne(Id: string, token: string): Promise<problem | null> {
  try {
    console.log("fetching problem ...");
    const get = await fetch(`${backend}/api/problems/${Id}`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${token}`,
      }
    });
    const getJSON = await get.json();
    console.log(getJSON);
    const prob: problem = getJSON.problem;
    return prob;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const defaultEditorCpp: string = `#include <bits/stdc++.h>
int main(){

return 0; 
}
`
export function ProblemPage() {
  /* use */
  const { Id } = useParams();
  const { sessionToken, user } = useContext(sessionContext);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  /* States */
  const [prob, setProb] = useState<problem | null>(null);
  const [sampleTestView, setSampleTestView] = useState<number>(0);

  useEffect(() => {
    const fetchProblem = async () => {
      if (sessionToken != "" && Id) {
        const problem = await getProblemOne(Id, sessionToken);
        setProb(problem);
      }
    };

    if (user.isValid)
      fetchProblem();
  }, [sessionToken]);

  /* State functions */
  const getCodeFromEditor = (): string => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      return code;
    } else {
      return "editor not mounted";
    }
  }

  async function submitCode(): Promise<string> {
    if (Id == undefined) {
      return "invalid problem Id";
    }
    try {
      const post = await fetch(`${backend}/api/submissions/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          code: getCodeFromEditor(),
          userId: user.userId,
          problemId: Id,
          language: "cpp",
          verdictId: null,
        }),
      });
      if (post.ok) return "submitted successfully";
      else return "submission failed!"
    } catch (err: string | any) {
      return "unexpected error occured"
    }
  }

  console.log(prob);
  /* Component */

  return (
    <div className="flex flex-col h-screen bg-neutral-100">

      {/* Header */}
      <div className="flex justify-center items-center h-1/20 p-1">
        <button
          onClick={async () => {
            const result = await submitCode();
            console.log(result);
          }}
          title="Run code"
          className="h-10 w-10 p-1 
          cursor-pointer rounded-xl hover:bg-neutral-300 hover:scale-90
          transition delay-75">
          <img src="/play.png" className="object-cover" />
        </button>
      </div>


      {/*Content*/}
      <div className="h-19/20 w-full  flex my-0.5 ">
        {/*Problem*/}
        <div className=" bg-white min-w-1/2  shrink-0 h-full 
          mx-1 p-5 text-neutral-900 prose  prose-sm">
          {prob == null ? (<h1 className="animate-pulse"> Fetching problem ... </h1>) : (
            <ProblemContents problem={prob} />
          )}
        </div>



        <div className="flex-1 flex  flex-col h-full gap-4 px-2">
          <div className="flex flex-col h-4/6">
            <div className="bg-white shrink-0 p-2 my-1 text-neutral-900">
              Select a language
            </div>

            <div className="min-h-0 grow my-1">
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


          <div className="grow bg-white">
            <div className="flex bg-neutral-200">
              {prob?.sampleTests.map((test: {
                input: string,
                output: string,
              }, index: number) => {
                return (
                  <div key={index}
                      className={`${sampleTestView == index ? "bg-white text-neutral-800" : "bg-neutral-900 text-neutral-50"}
border px-10 py-2 border-neutral-200 m-1 transition delay-75 hover:-translate-y-1
cursor-pointer`}
                    onClick={() => setSampleTestView(index)}>
                    Test {index}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
