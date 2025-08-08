import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { sessionContext, type problem } from "../contexts/SessionContextProvider";
import * as monaco from "monaco-editor"

import type { testResult } from "./types";
import type { VerdictType } from "./types";


import { PageLeftProblem } from "./PageLeftProblem";
import { PageLeftSubmit } from "./PageLeftSubmit";
import { Disclaimer } from "../AuthPage/components";
import { PageRight } from "./PageRight";
import { PageLeftRun } from "./PageLeftRun";
import { AIWindow } from "./AIWindow";
import { compileFunction } from "vm";


const backend: string = import.meta.env.VITE_BACKEND || "";
if (!backend) {
  console.error("backend url not provided");
}
const compiler: string = import.meta.env.VITE_COMPILER || "";
// console.log(compiler);
if (!compiler) {
  console.error("compiler url not provided");
}

export function Problem() {

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

  /* states */
  const [submittedCount, setSubmittedCount] = useState<number>(0);
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
      navigate("/Login", {
        state: {
          previous: `/Problem/${Id}`
        }
      })
      return;
    }
    setRunVerdict(null);
    if (prob === null) {
      setErrMsg({
        color: "red",
        message: "Invalid problem. cannot run",
      });
      return;
    }

    setContent(2);
    setLoadMsg("Running your code")
    setErrMsg({ message: "", color: " " });
    try {
      const get = await Fetch(`${compiler}/run`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${sessionToken}`
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

      if (!get) {
        navigate("/Login");
        return;
      }

      const getJSON = await get.json();
      // console.log(getJSON);
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
    // console.log(sessionToken);
    setSubmittedCount(prev => prev + 1);
    if (!sessionToken) {
      sessionStorage.setItem("recent_code", getCodeFromEditor());
      navigate("/Login", {
        state: {
          previous: `/Problem/${Id}`,
        }
      })
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
          "authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          code: getCodeFromEditor(),
          userId: user?._id,
          problemId: Id,
          language: "cpp",
          verdictId: null,
          testId: prob?.testId,
        }),
      });

      if (!post) {navigate("/Login"); return;}

      const postJSON = await post.json();
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


  /* component */
  return (
    <div className="flex flex-col items-center h-screen bg-gray-400">

      {/* HEADER */}
      <div className="flex items-center my-1 w-full h-1/25 py-2">

        {/* BACK */}
        <div className="flex m-2 flex-1 justify-begin items-center w-1/2   h-1/20 p-1">
          <button className="py-2 px-4  z-10 shadow-xl cursor-pointer
              border border-neutral-400 
            rounded-full bg-white m-0.5 
            hover:-translate-x-2  hover:bg-neutral-400 transition delay-75"
            onClick={() => navigate("/Problems")}>
            Back to Problems
          </button>
        </div>

        <div className="flex m-2 flex-1 justify-center items-center w-1/2   h-1/20 p-1">

          {/* RUN */}
          <button
            onClick={async () => {
              await runCode();
            }}
            title="Run code"
            className="h-10 w-10 p-1 
          cursor-pointer rounded-full hover:bg-neutral-300 hover:scale-90
          transition delay-75 m-0.5 border border-neutral-400 z-10 shadow-xl bg-white">
            <img src="/play.png" className="object-cover" />
          </button>


          {/* SUBMIT */}
          <button className="m-1 p-3 rounded-full hover:bg-neutral-300 transition delay-75  
cursor-pointer min-w-0 h-10 flex justify-between items-center gap-1 hover:-translate-y-1 
            border border-neutral-400 shadow-xl z-10 bg-white transform duration-100"
            onClick={async () => { await submitCode(); }} >
            <div className="h-5 w-5">
              <img src="/submit.png" className="h-full w-full  object-cover" />
            </div>
            <p>Submit</p>
          </button>

        </div>

        {/* USER */}
        {/* BACK */}
        <div className="flex m-2 flex-1 justify-end items-center w-1/2   h-1/20 p-1">
          <button className="py-2 px-4  z-10 shadow-xl cursor-pointer
              border border-neutral-400 
            rounded-full bg-white m-0.5 
            hover:scale-110 hover:bg-neutral-400 transition delay-75"
            onClick={() => navigate("/user")}>
            {sessionToken ? `${user?.username}` : "Login"}
          </button>
        </div>
      </div>


      {/* CONTENT */}
      <div className="flex-1 w-full flex  justify-between gap-1 my-0.5 ">
        {/* CONTENT-LEFT */}
        <div className="flex-1  flex flex-col mx-1 justify-between gap-2">

          {/* ACTION WINDOW */}
          <div className={`relative rounded-lg bg-white  h-full  flex-5 basis-0  p-3 w-full  text-neutral-900 
          border-neutral-400 border  overflow-y-auto shadow
          ${mount ? "translate-y-0" : "translate-y-5"} transition delay-150`}>

            <div className="flex flex-col  prose min-w-full h-full">
              {!content &&
                <div>
                  {prob === null ?
                    <h1 className="animate-pulse"> {loadMsg} </h1>
                    : <PageLeftProblem problem={prob} />}
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

          {/* AI WINDOW */}
          <AIWindow
            editorRef={editorRef}
            Id={Id}
            errMsg={errMsg}
            submittedCount={submittedCount}
            problemId={Id}
            code={editorRef}
            setErrMsg={setErrMsg} />

        </div>


        <div className="flex-1 ">
          <PageRight
            editorRef={editorRef}
            prob={prob}
            setSampleTests={setSampleTests}
            sampleTests={sampleTests}
          />
        </div>
      </div>

      {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
    </div >
  )
}
