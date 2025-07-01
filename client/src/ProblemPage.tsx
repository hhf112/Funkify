import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { sessionContext, type problem } from "./contexts/SessionContextProvider";
import { ProblemContents } from "./ProblemContents";


import * as monaco from "monaco-editor";
import Editor from "@monaco-editor/react";

const backend: string = import.meta.env.VITE_BACKEND || "";


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

const defaultEditorCpp : string = `#include <bits/stdc++.h>
int main(){

return 0; 
}
`
export function ProblemPage() {
  /* use */
  const { Id } = useParams();
  const { sessionToken, user } = useContext(sessionContext);
  const codeInputRef = useRef<any>(null);

  /* States */
  const [prob, setProb] = useState<problem | null>(null);

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
  async function runCode() {
    try {
      const post = await fetch(`${backend}/api/submissions/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          code: codeInputRef.current.value,
          userId: user.userId,
          problemId: Id,
          language: "cpp",
        })
      });

      const postJSON = await post.json();
      console.log(postJSON);
    } catch (err) {
      console.log(err);
      return;
    }

  }

  /* Component */
  return (
    <div className="flex flex-col h-screen bg-neutral-100">

      {/* Header */}
      <div className="flex justify-center align-middle h-1/20 p-2">
        <img src="/play.png" className="cursor-pointer h-8 w-8"
          onClick={() => runCode()} />
      </div>


      {/*Content*/}
      <div className="h-19/20 w-full  flex p-2">
        {/*Problem*/}
        <div className=" bg-white min-w-1/2  shrink-0 h-full mx-1 p-5 text-neutral-900 prose  prose-sm">
          {prob == null ? (<h1 className = "animate-pulse"> Fetching problem ... </h1>) : (
            <ProblemContents problem={prob} />
          )}
        </div>
        <div className="flex-1 flex  flex-col h-full gap-4 px-2">
          <div className="flex flex-col min-h-4/6">
            <div className="bg-white shrink-0 p-2 my-1 text-neutral-100">
              Language
              <select className="mx-4">
              </select>
            </div>
            <div className="h-full my-1">
              <Editor
                options={{
                  lineNumbers: "on",
                }}
                height="100%" width="100%"
                defaultLanguage="cpp"
                defaultValue= {defaultEditorCpp}
                onMount={(editor: monaco.editor.IStandaloneCodeEditor) => {
                  codeInputRef.current = editor;
                }}
                theme="vs-dark"
              />
            </div>
          </div>
          <div className="grow bg-white">
          </div>
        </div>
      </div>
    </div>
  )
}
