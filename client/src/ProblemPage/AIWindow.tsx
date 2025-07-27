import { Dispatch, RefObject, SetStateAction, useContext, useEffect, useState } from "react";
import { sessionContext } from "../contexts/SessionContextProvider";

const backend = import.meta.env.VITE_BACKEND || "";
if (!backend) {
  console.error("backend url not found")
  process.exit(1);
}

function Button({ onClick, text }: { onClick: () => any, text: string }) {
  return <button
    className="border my-2 w-full py-2 cursor-pointer hover:scale-105
        hover:-translate-y-1 transform duration-100 transition-all delay-75 rounded-full bg-white border-neutral-200 text-neutral-500"
    onClick={onClick}>
    {text}
  </button>

}

export function AIWindow({
  problemId,
  code,
  submittedCount,
  errMsg,
  Id,
  editorRef,
  setErrMsg,
}: {
  editorRef: any,
  Id: string | null,
  errMsg: { message: string, color: string },
  setErrMsg: Dispatch<SetStateAction<{ color: string, message: string }>>,
  code: RefObject<any>,
  problemId: string
  submittedCount: number
}) {
  const { sessionToken } = useContext(sessionContext);
  const [mount, setMount] = useState<boolean>(false);
  const [hoverAI, setHoverAI] = useState<boolean>(false);
  const [AIAdvice, setAIAdvice] = useState<string>("Nothing to see here! try your best at the problem statement!");
  const [askAICount, setaskAICount] = useState<number>(0);
  const [what, setWhat] = useState<number>(0);
  const [whatSelector, setWhatSelector] = useState<number>(0);
  // -1 SELECT



  // console.log(sessionToken)
  useEffect(() => setMount(true));
  useEffect(() => {
    if (submittedCount > 0) setAIAdvice("Stuck? need some help?~ 🦹‍♀️");
  }, [submittedCount]);


  async function getAIAdvice(what: number) {
    setWhat(0);
    setErrMsg({
      message: "Fetching advice ...",
      color: "amber"
    });
    setAIAdvice("You only get 5 requests per day! use them carefully! 🙆‍♀️");

    try {
      const advice = await fetch(`${backend}/api/user/ai/sum/${Id}?what=${what}`, {
        method: "GET",
        headers: {
          "authorization": `Bearer ${sessionToken}`,
        },
      });

      if (advice.status === 429) {
        setErrMsg({
          message: "You are allowed 2 requests per minute and 5 requests per day.",
          color: "red"
        });
        setAIAdvice("don't get ahead of yourself! 🙆‍♀️")
        setTimeout(() => setErrMsg({ message: "", color: "" }), 3000);
        return;
      }

      const adviceJSON = await advice.json();
      console.log(adviceJSON.summary);
      if (what === 2) {
        // editorRef.current?.setValue(adviceJSON.summary.slice(7, -4));
        const raw = adviceJSON.summary.slice(7, -4);
        const decoded = raw
          .replace(/\\\\/g, '\\')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'");
        editorRef.current?.setValue(decoded);
        setErrMsg({message: "", color: ""});
        return;
      }
      setAIAdvice(adviceJSON.summary.slice(1, -1));

      setErrMsg({
        message: "",
        color: "amber"
      });
    } catch (err) {
      console.log(err);
    }
  }


  /* component */
  return (
    <div className={`relative flex-1 rounded-xl border-neutral-400 mb-1 shadow border bg-white
          ${hoverAI && "border-3 shadow-xl shadow-cyan-400 border-yellow-400"} 
           ${mount ? "opacity-100 translate-y-0" : "opacity-5 -translate-y-2"} 
      transform duration-200 transition delay-200 p-3`}>


      <div className="flex">
        <button
          className="absolute -top-7 -right-5 m-2 p-3 
                  border-neutral-200 border shadow font-bold  text-sm text-neutral-700 rounded-full bg-white
                  cursor-pointer opacity-50
                  hover:scale-110 hover:-translate-y-1 hover:text-white hover:bg-cyan-400 hover:opacity-100
                  transform duration-100 transition-all delay-100"
          onClick={async () => {
            if (submittedCount < 1) {
              setErrMsg({
                color: "amber",
                message: "You have to submit code at least once to use this feature!"
              })
              return;
            }
            setWhat(-1);
          }}
          onMouseOver={() => setHoverAI(true)}
          onMouseLeave={() => setHoverAI(false)}>
          Ask AI {hoverAI ? "💁‍♀️" : "✨"}
        </button>
      </div>

      {
        what === -1 ?
          <div
            className="flex flex-col items-center h-full w-full bg-neutral-50">
            <Button
              onClick={() => getAIAdvice(0)}
              text={"Get a summary of the problem statement 📃"}
            />
            <Button
              onClick={() => getAIAdvice(1)}
              text={"Get a Hint! 💡"}
            />
          </div>
          :
          <textarea
            readOnly
            className="mt-2 font-Inter text-neutral-700 whitespace-pre-wrap resize-none w-full h-full focus:outline-none focus:ring-0 focus:border-transparent"
            value={AIAdvice} />
      }

    </div >
  )
}
