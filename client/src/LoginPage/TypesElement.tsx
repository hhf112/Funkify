import { useEffect, useState } from "react"

export function TypeLoginButton({ display, doThisAsync }: {
  display: string,
  doThisAsync: () => Promise<void> | void,
}) {
  return (
    <button onClick={() => doThisAsync()}
      className="cursor-pointer hover:bg-cyan-300 hover:text-black 
      my-4 text-lg border border-neutral-700 
      bg-neutral-800 text-neutral-100 p-3 mx-2
          shadow-neutral-500 shadow-lg
        transition delay-75 hover:-translate-y-2 hover:scale-100">
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
    <div className={`${mountAnimation ? "-translate-y-2" : "translate-y-2"} transition delay-00  border border-neutral-400 p-2 ${color[colorClass]}`}>
      <h2 className="text-white font-semibold ">
        {display}
      </h2>
    </div>
  )
}

export function Loader({ display }: { display: string }) {

  return (
    <div className="flex">
      <p className="text-neutral-800"> {display} </p>
      <img src="/loader.png" className=" animate-pusle w-4 h-4 my-1 mx-1" />
    </div>
  )

}
