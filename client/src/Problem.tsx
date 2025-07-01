import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { sessionContext, type problem } from "./contexts/SessionContextProvider";
import { ProblemContents } from "./ProblemContents";


import Editor from '@monaco-editor/react';

const backend: string = import.meta.env.VITE_BACKEND || "";


const test: problem = {
  title: "Longest Harmonious Subsequence",
  description: `We define a harmonious array as an array where the difference between its maximum value and its minimum value is exactly 1.

Given an integer array nums, return the length of its longest harmonious subsequence
among all its possible subsequences.1`,
  createdAt: new Date,
  author: "someone",
  userId: "someuserId",
  tags: ["some tag"],
  difficulty: "Easy",
  sampleTests: [{
    input: 'something',
    output: "something",
  }],
  constraints: {
    memory_md: 123123,
    runtime_s: 312312,
  },
  testSolution: "somesolution",
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

export function Problem() {
  const { Id } = useParams();
  const [prob, setProb] = useState<problem | null>(null);
  const { sessionToken, user } = useContext(sessionContext);

  useEffect(() => {
    const fetchProblem = async () => {
      if (sessionToken != "" && Id) {
        const problem = await getProblemOne(Id, sessionToken);
        setProb(problem);
      }
    };


    if (user.isValid) {
      fetchProblem();
    } else setProb(test);
  }, [sessionToken]);

  return (
    <div className="flex flex-col h-screen bg-black">
      {/*Header*/}

      <div className="h-1/20">
      </div>


      {/*Content*/}
      <div className="h-19/20 flex justify-stretch p-2">
        {/*Problem*/}

        <div className="bg-neutral-800 w-1/2 h-full mx-1 p-5 text-amber-50">
          {prob  == null ? (<h1> Fetching problem ... </h1>):(
            <ProblemContents problem={prob} />
          )}
        </div>

        {/*Editor and tests*/}
        <div className="grow flex flex-col h-full gap-4 px-2">

          {/*Editor*/}
          <div className="h-3/5">
            <Editor height="100%" width="100%" defaultLanguage="cpp" defaultValue="// some comment" theme="vs-dark" />;
          </div>

          {/*Testcases*/}
          <div className=" bg-neutral-800 h-2/5">
          </div>
        </div>
      </div>
    </div>
  )
}
