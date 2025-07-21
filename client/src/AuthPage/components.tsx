import { useEffect, useState } from "react"

export function TypeLoginButton({ display, doThisAsync }: {
  display: string,
  doThisAsync: () => Promise<void> | void,
}) {
  return (
    <button onClick={() => doThisAsync()}
      className="cursor-pointer shadow-neutral-500 shadow-lg rounded-xl
      my-4 text-lg border-2 border-neutral-500 bg-neutral-800 text-neutral-100 p-3 mx-2 
      hover:bg-cyan-300 hover:text-black hover:-translate-y-2 hover:scale-100 hover:shadow-yellow-100
      transition delay-75 ">
      {display}
    </button>
  )
}

export function Disclaimer({ display, colorClass }:
  { display: string, colorClass: string }) {
  const [mountAnimation, setMountAnimation] = useState<boolean>(false);
  useEffect(() => {
    setMountAnimation(true);
    return () => {
      setMountAnimation(false);
    }
  }, []);

  const color: Record<string, string> = {
    "green": "bg-green-400",
    "red": "bg-red-400",
    "amber": "bg-amber-400",
  }
  return (
    <div className={`fixed bottom-5 ${mountAnimation ? "translate-y-0 scale-100" : "scale-80 translate-y-2"} 
transform duration-300 transition-all delay-75 ${color[colorClass]} py-2 px-3 rounded-xl opacity-100`}>
      <h2 className="text-white font-semibold ">
        {display}
      </h2>
    </div>
  )
}

export function Loader({ display }: { display: string }) {

  return (
    <div className="flex">
      <p className="text-neutral-800 font-mono animate-pulse"> {display} </p>
    </div>
  )

}
