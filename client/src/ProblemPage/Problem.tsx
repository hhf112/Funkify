import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { sessionContext, type problem } from "../contexts/SessionContextProvider";
import { PageLeftProblem } from "./PageLeftProblem.js";

import * as monaco from "monaco-editor"
import { PageLeftSubmit } from "./PageLeftSubmit.js";
import { Disclaimer } from "../LoginPage/TypesElement.js";
import { PageRight } from "./PageRight.js";
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

interface VerdictType {
  verdict: string,
  error?: string,
  stdout: string,
  stderr: string,
  submissionId: string,
  userId: string,
  memory_mb: number,
  runtime_ms: number,
  testsPassed: number,
}
export function ProblemPage() {
  /* use */
  const { Id } = useParams();
  if (!Id) {
    return (
      <h1> Problem Id not attached </h1>
    )
  }
  const { sessionToken, user } = useContext(sessionContext);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  /* States */
  const [done, setDone] = useState<boolean>(false);
  const [verdict, setVerdict] = useState<VerdictType | null>(null)
  const [prob, setProb] = useState<problem | null>(null);
  const [content, setContent] = useState<number>(0);
  const [submissionId, setSubmissionId] = useState<string>("");
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
    setVerdict(null);
    setDone(false);
    setErrMsg({
      message: "submitting your code ...",
      color: "amber",
    });
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
      setSubmissionId(postJSON.submissionId);
      if (!post.ok) {
        setErrMsg({
          color: "red",
          message: "Submission failed"
        });
        return;
      }
      setContent(1);
      setErrMsg({
        color: "amber",
        message: "Fetching verdict"
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

        <button className="m-0.5 p-2 rounded-xl hover:bg-neutral-300 transition delay-75 hover:scale-90 
cursor-pointer min-w-0 h-10 flex justify-between gap-1 "
          onClick={async () => { await submitCode(); }} >
          <img src="/submit.png" className="shrink-0 object-cover " />
          Submit
        </button>
      </div>


      {/* CONTENT */}
      <div className="h-19/20 w-full flex justify-between gap-1 my-0.5">
        {/* CONTENT-LEFT */}
        <div className=" bg-white  h-full flex-3 basis-0 mx-1 p-5 text-neutral-900">
          <div className="prose prose-sm max-w-none h-full w-full">
            {!content &&
              <div>
                {prob == null ? (<h1 className="animate-pulse"> {loadMsg} </h1>) : (
                  <PageLeftProblem problem={prob} />)}
              </div>
            }

            {content == 1 &&
              <PageLeftSubmit
                setContent={setContent}
                submissionId={submissionId}
                verdict={verdict}
                setVerdict={setVerdict}
                done={done}
                setDone={setDone}
                setErrMsg={setErrMsg}
              />}
          </div>
        </div>

        <PageRight
          editorRef={editorRef}
          prob={prob}
        />
      </div>

      {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
    </div>
  )
}
