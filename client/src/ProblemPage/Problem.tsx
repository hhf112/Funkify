import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { sessionContext, type problem } from "../contexts/SessionContextProvider";
import { PageLeftProblem } from "./PageLeftProblem";
import { PageLeftSubmit } from "./PageLeftSubmit";
import { Disclaimer } from "../LoginPage/TypesElement";
import { PageRight } from "./PageRight";
import { PageLeftRun } from "./PageLeftRun";
import type { testResult } from "./types";

import type { VerdictType } from "./types";

import * as monaco from "monaco-editor"

const backend: string = import.meta.env.VITE_BACKEND || "";
const compiler: string = import.meta.env.VITE_COMPILER || "";;

export function ProblemPage() {
  /* use */
  const { Id } = useParams();
  if (!Id) {
    return (
      <h1> Problem Id not attached </h1>
    )
  }
  const { sessionToken, Fetch, user } = useContext(sessionContext);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const navigate = useNavigate();

  /* States */
  const [mount, setMount] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [verdict, setVerdict] = useState<VerdictType | null>(null)
  const [prob, setProb] = useState<problem | null>(null);
  const [content, setContent] = useState<number>(0);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [sampleTests, setSampleTests] = useState<{ input: string, output: string, }[]>([]);
  const [runVerdict, setRunVerdict] = useState<{
    finalVerdict: string,
    results: testResult[]
  } | null>(null);

  // PROBLEM 0 
  // SUBMISSIONS 1,
  const [errMsg, setErrMsg] = useState<{
    color: string,
    message: string,
  }>({
    color: "",
    message: "",
  });
  const [loadMsg, setLoadMsg] = useState<string>("");


  useEffect(() => {
    setMount(true)
    const fetchProblem = async () => {
      setLoadMsg("Fetching problem");
      try {
        const get = await fetch(`${backend}/api/problems/${Id}`);
        const getJSON = await get.json();
        const prob: problem = getJSON.problem;
        if (!prob) throw new Error("Problem not found!")
        setLoadMsg("");
        setProb(prob);
        setSampleTests(prob.sampleTests);
      } catch (err: any) {
        console.log(err);
        setLoadMsg(err.message);
      }
    };

    fetchProblem()
  }, []);

  /* State functions */
  const getCodeFromEditor = (): string => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      return code;
    } else {
      return "editor not mounted";
    }
  }

  async function runCode() {
    if (!sessionToken) {
      navigate("/Login")
      return;
    }
    setRunVerdict(null);
    if (prob == null) {
      setErrMsg({
        color: "red",
        message: "Invalid problem. cannot run",
      });
      return;
    }

    console.log(sampleTests);
    setContent(2);
    setLoadMsg("Running your code")
    try {
      const get = await Fetch(`${compiler}/run`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          language: "cpp",
          code: getCodeFromEditor(),
          tests: sampleTests.map((test: { input: string, output: string }) =>
            ({ input: test.input, output: test.output })),
          timeLimit: prob?.constraints.runtime_s,
          linesPerTestCase: prob.linesPerTestCase,
        })
      });
      const getJSON = await get?.json();
      console.log(getJSON);
      setRunVerdict({ finalVerdict: getJSON.finalVerdict, results: getJSON.results });
    } catch (err: any) {
      console.log(err);
      setErrMsg({
        color: "red",
        message: err.message,
      })
    }

  }
  async function submitCode(): Promise<void> {
    if (!sessionToken) {
      navigate("/Login")
      return;
    }
    setVerdict(null);
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
      const post = await Fetch(`${backend}/api/user/submissions/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
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
      const postJSON = await post?.json();
      setSubmissionId(postJSON.submissionId);
      if (!post?.ok) {
        setErrMsg({
          color: "red",
          message: "Submission failed"
        });
        return;
      }
      setContent(1);
      setDone(false);
      setErrMsg({
        color: "amber",
        message: "Fetching verdict"
      });
    } catch (err: string | any) {
      console.error(err);
      setErrMsg({
        color: "red",
        message: "Unexpected error occured"
      });
    }
  }


  /* Component */
  return (
    <div className="flex flex-col items-center h-screen bg-neutral-100">

      {/* Header */}
      <div className="flex  mt-2 w-full h-1/20">
        <div className="flex m-2 flex-1 justify-begin items-center w-1/2   h-1/20 p-1">
          <button className="py-2 px-2 z-10 shadow-xl cursor-pointer
              border rounded-xl bg-white m-0.5 hover:scale-90 hover:bg-neutral-400 transition delay-75"
          onClick={()=> navigate("/")}>
            Back to Home
          </button>
        </div>

        <div className="flex m-2 flex-1 justify-center items-center w-1/2   h-1/20 p-1">
          <button
            onClick={async () => {
              await runCode();
            }}
            title="Run code"
            className="h-10 w-10 p-1 
          cursor-pointer rounded-lg hover:bg-neutral-300 hover:scale-90
          transition delay-75 m-0.5 border border-neutral-400 z-10 shadow-xl bg-white">
            <img src="/play.png" className="object-cover" />
          </button>

          <button className="m-1 p-2 rounded-lg hover:bg-neutral-300 transition delay-75 hover:scale-90 
cursor-pointer min-w-0 h-10 flex justify-between gap-1 border border-neutral-400 shadow-xl z-10 bg-white"
            onClick={async () => { await submitCode(); }} >
            <img src="/submit.png" className="shrink-0 object-cover " />
            Submit
          </button>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <div>
            <button> Profile</button>
          </div>

        </div>
      </div>


      {/* CONTENT */}
      <div className="h-19/20 w-full flex justify-between gap-1 my-0.5 ">
        {/* CONTENT-LEFT */}
        <div className={`rounded-lg bg-white  h-full flex-3 basis-0 mx-1 p-3 w-full  text-neutral-900 border-neutral-400 border 
          shadow-lg shadow-neutral-800 ${mount ? "translate-y-0" : "translate-y-5"} transition delay-150`}>
          <div className=" prose prose-sm max-w-none h-full w-full ">
            {!content &&
              <div>
                {prob == null ? (<h1 className="animate-pulse"> {loadMsg} </h1>) : (
                  <PageLeftProblem problem={prob} />)}
              </div>
            }

            {content === 1 &&
              <PageLeftSubmit
                setContent={setContent}
                submissionId={submissionId}
                verdict={verdict}
                setVerdict={setVerdict}
                done={done}
                setDone={setDone}
                setErrMsg={setErrMsg}
              />}

            {content === 2 &&
              <PageLeftRun
                setContent={setContent}
                runVerdict={runVerdict}
                setRunVerdict={setRunVerdict}
              />}
          </div>
        </div>

        <PageRight
          editorRef={editorRef}
          prob={prob}
          setSampleTests={setSampleTests}
          sampleTests={sampleTests}
        />
      </div>

      {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
    </div>
  )
}
