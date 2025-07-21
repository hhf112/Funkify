import { useEffect, useState } from "react";

export function VerdictCard({ message }: { message: string }) {
  const [mount, setMount] = useState<boolean>(false);
  console.log(mount);

  useEffect(() => setMount(true), []);

  const colors: Record<string, string> = {
    "Wrong Answer": "bg-red-400", // WRONG ANSWER
    "Compilation Error": "bg-amber-400", // ERROR
    "Runtime Error": "bg-amber-400", // ERROR
    "Accepted": "bg-green-400", // ACCEPTED
    "Time Limit Exceeded": "bg-neutral-400" // TIME LIMIT EXCEEDED
  }

  return (
    <div className={`relative w-full ${mount ? "" : "bg-neutral-50"} transition delay-100`}>
      <div className={`border absolute bottom-4 -right-2 h-4/5 w-full -z-10 bg-neutral-900
        shadow shadow-neutral-400 
    ${mount ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
            transform duration-100 transition-all delay-200`} />
      <h1 className={`${colors[message]} border w-full text-center py-9 text-white border-neutral-900 
      ${mount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
      transform duration-100 transition-all delay-300`}>
        {message.toUpperCase()}
      </h1>
    </div>
  )

}
