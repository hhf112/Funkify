import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useContext } from "react";
import { sessionContext } from "../contexts/SessionContextProvider";

const backend = import.meta.env.VITE_BACKEND;
if (!backend) {
  console.error("backend url not provided");
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

export function PageLeftSubmit({
  setContent,
  submissionId,
  verdict,
  setVerdict,
  done,
  setDone,
  setErrMsg,
}: {
  setErrMsg: Dispatch<SetStateAction<{
    color: string,
    message: string,
  }>>
  done: boolean
  setDone: Dispatch<SetStateAction<boolean>>
  submissionId: string,
  verdict: VerdictType | null,
  setVerdict: Dispatch<SetStateAction<VerdictType | null>>,
  setContent: Dispatch<SetStateAction<number>>,
}) {
  const { sessionToken } = useContext(sessionContext)

  useEffect(() => {
    const interval = setInterval(async () => {
      if (done) return;
      try {
        const get = await fetch(`${backend}/api/submissions/${submissionId}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${sessionToken}`,
          },
        });
        const getJSON = await get.json();
        console.log(getJSON);
        if (getJSON.submission.status == "processed") {
          const verdictId = getJSON.submission.verdictId;

          try {
            const get = await fetch(`${backend}/api/submissions/verdict/${verdictId}`, {
              method: "GET",
              headers: {
                authorization: `Bearer ${sessionToken}`,
              }
            });
            const getJSON = await get.json();
            console.log(getJSON.verdict);

            setVerdict(getJSON.verdict);
            setErrMsg({
              color: "",
              message: "",
            })
            setDone(true);
            clearInterval(interval);
          } catch (err) {
            console.error("cannot get verdict");
            clearInterval(interval);
            setDone(true);
          }
          clearInterval(interval);
          setDone(true);
        }
      } catch (err) {
        console.error("unbale to fetch result");
        return;
      }
    }, 2000);


    return () => clearInterval(interval);
  }, [verdict])


  {/* COMPONENT */ }
  return (
    <div className="h-full w-full flex flex-col items-start ">
      <button onClick={() => setContent(0)}
        className="cursor-pointer hover:bg-neutral-200 p-2 rounded-xl hover:-translate-x-2 transition delay-75 
        flex justify-between gap-1 items-center min-w-0 h-8 m-2">
        <p className="align-middle"> Back to problem </p>
        <img src="/left-arrow.png" className="shrink-0 object-contain p-1 h-8 w-8" />
      </button>

      <div className="border min-w-0"> </div>
      {verdict && (
        <div className="flex flex-col items-center prose">
          <h1> Verdict </h1>
          <div className="flex flex-col mx-1 p-1 ">
            <h1 className="m-0 border p-4 text-3xl bg-red-400 text-white"> {verdict.verdict} </h1>
            <h4> stdout: </h4>
            <p className="text-sm m-0"> {verdict.stdout} </p>
            <h4> stderr: </h4>
            <p className="text-sm m-0"> {verdict.stderr} </p>
          </div>
        </div>
      )
      }
      {verdict?.error && (
        <div className="mx-1">
          <h4> error: </h4>
          <p className="text-sm m-0"> {verdict.error} </p>
        </div>
      )
      }

    </div>

  )

}
