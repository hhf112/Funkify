import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { sessionContext, type problem } from "../contexts/SessionContextProvider";
import { ProblemContents } from "./ProblemContents.js";

import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor"
import { SubmissionContents } from "./SubmissionContents.js";
import { Disclaimer } from "../LoginPage/TypesElement.js";
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
  const [content, setContent] = useState<number>(0);
  // PROBLEM 0 
  // SUBMISSIONS 1,
  const [errMsg, setErrMsg] = useState<{
    color: string,
    message: string,
  }>({
    color: "red",
    message: "No login found",
  });
  const [loadMsg, setLoadMsg] = useState<string>("");

  useEffect(() => {
    const fetchProblem = async () => {
      setLoadMsg("Fetching problem");
      try {
        const get = await fetch(`${backend}/api/problems/${Id}`, {
          method: "GET",
          headers: {
            "authorization": `Bearer ${sessionToken}`,
          }
        });
        const getJSON = await get.json();
        const prob: problem = getJSON.problem;
        if (!prob) throw new Error("Problem not found!")
        setLoadMsg("");
        setProb(prob);
      } catch (err: any) {
        console.log(err);
        setLoadMsg(err.message);
      }
    };

    if (sessionToken != "") {
      setErrMsg({
        color: "green",
        message: "",
      })
      fetchProblem()
    }
    else setLoadMsg("Verifying your login")
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

  async function submitCode(): Promise<void> {
    if (Id == undefined) {
      setErrMsg({
        color: "red",
        message: "invalid problem Id"
      });
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
          testId: prob?.testId,
        }),
      });
      const postJSON = await post.json();
      console.log(postJSON);
      if (!post.ok) {
        setErrMsg({
          color: "red",
          message: "Submission failed"
        });
        return;
      }
      setContent(1);
      setErrMsg({
        color: "green",
        message: "Submitted successfully"
      });
    } catch (err: string | any) {
      console.log(err);
      setErrMsg({
        color: "red",
        message: "Unexpected error occured"
      });
    }
  }

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
          transition delay-75 m-0.5">
          <img src="/play.png" className="object-cover" />
        </button>

        <div className="m-0.5 p-2 rounded-xl hover:bg-neutral-300 transition delay-75 hover:scale-90 
          cursor-pointer min-w-0 h-10 flex justify-between gap-1 ">
          <button
            onClick={async () => {
              const result = await submitCode();
              console.log(result);
            }} className="cursor-pointer">
            Submit
          </button>
          <img src="/submit.png" className="shrink-0 object-cover" />
        </div>
      </div>


      {/* CONTENT */}
      <div className="h-19/20 w-full flex justify-between gap-1 my-0.5">
        {/* CONTENT-LEFT */}
        <div className=" bg-white  h-full flex-3 basis-0 mx-1 p-5 text-neutral-900">
          <div className="prose prose-sm max-w-none h-full w-full">
            {!content &&
              <div>
                {prob == null ? (<h1 className="animate-pulse"> {loadMsg} </h1>) : (
                  <ProblemContents problem={prob} />)}
              </div>
            }

            {content == 1 && <SubmissionContents />}
          </div>
        </div>

        {/* CONTENT-RIGHT */}
        <div className="flex-4 flex flex-col justify-between gap-2 h-full px-2">

          {/* EDITOR */}
          <div className="flex flex-col min-h-0 flex-2">
            <div className="bg-white flex-1 min-h-0  p-2 my-1 text-neutral-900">
              Select a language
            </div>
            <div className="flex-13 min-h-0">
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


          <div className="flex-1 min-h-0 flex flex-col bg-white">
            <div className="flex w-full bg-neutral-200">
              {prob?.sampleTests.map((_, index: number) => {
                return (
                  <div key={index}
                    className={`${sampleTestView == index ? "bg-white text-neutral-800" : "bg-neutral-900 text-neutral-50"}
                       px-10 py-2 border-neutral-200 mx-1 cursor-auto `}
                    onMouseOver={() => setSampleTestView(index)}>
                    Test {index}
                  </div>
                )
              })}

              <div className="text-xl text-white bg-neutral-900 border-neutral-900
                hover:-translate-y-1 hover:bg-blue-400
                px-10 py-2  mx-1 transition delay-75 cursor-pointer">
                +
              </div>
            </div>


            {prob?.sampleTests &&
              <div className="bg-white text-neutral-800 grow py-1 px-1 flex items-stretch m-2  h-full">
                <div className="grow-1 flex flex-col m-1 h-full">
                  <h3 className="text-xs text-neutral-400 font-bold my-0.5 flex-1">Input </h3>
                  <textarea
                    className="border border-neutral-300 resize-none w-full flex-7 px-1"
                    value={prob.sampleTests[sampleTestView].input} />
                </div>

                <div className="grow-1 flex flex-col m-1 h-full">
                  <h3 className="text-xs text-neutral-400 font-bold my-0.5 flex-1">Output </h3>
                  <textarea
                    className="border border-neutral-300 resize-none w-full flex-7 px-1"
                    value={prob.sampleTests[sampleTestView].output} />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
    </div>
  )
}
