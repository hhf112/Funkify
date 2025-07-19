import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

function Test({ key }: { key: number }) {
  return <div className="flex flex-col mb-4 border p-2 rounded-xl border-neutral-200">
    <input className="p-2 rounded-xl border border-neutral-200 font-Inter my-1" placeholder="Input" />
    <input className="p-2 rounded-xl border border-neutral-200 font-Inter my-1" placeholder="Ouptut" />
  </div>
}

export function AddProblem({ setAddProblemWindow }: {
  setAddProblemWindow: Dispatch<SetStateAction<boolean>>,
}) {

  const [mount, setMount] = useState<boolean>(false);
  useEffect(() => setMount(true));
  

  return (
    <div className="fixed z-50  flex inset-0 justify-center items-center bg-neutral-700/50">

      <div className={`relative h-170 w-200 rounded-xl bg-white
      ${mount ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} 
      transition-all transform delay-100 duration-300`}>

        <button className="absolute -top-5 -right-5 m-2 h-10 w-10 rounded-xl p-1 cursor-pointer 
          hover:bg-red-400 hover:scale-110 transition-all delay-100"
          onClick={() => setAddProblemWindow(false)}>
          <img src="/remove.png" className="h-full w-full" />
        </button>

        <div className="flex flex-col px-5 pt-10 pb-5 h-full">
          <div className="flex flex-col">
            <input className="p-3 rounded-xl border border-neutral-200 font-Inter my-1" placeholder="Title" />
            <textarea className="p-3 rounded-xl border border-neutral-200 font-Inter my-1" placeholder="Description" />
          </div>

          <div className="my-2 flex justify-between gap-1 h-1/2"> 

            {/*Sample Tests */}
            <div className="flex flex-col h-full w-1/2 border border-neutral-200 rounded-xl">
              <p className="m-1 text-center text-white bg-neutral-800 rounded-lg"> Sample Tests </p>
              <div className="flex flex-col h-full overflow-auto px-3">
                {[0, 0, 0].map(el => <Test key={0} />)}
              </div>
            </div>


            {/*Hidden Tests */}
            <div className="flex flex-col h-full w-1/2 border border-neutral-200 rounded-xl">
              <p className="m-1 text-center text-white bg-neutral-800 rounded-lg"> Hidden Tests </p>
              <div className="flex flex-col h-full overflow-auto px-3">
                {[0, 0, 0].map(el => <Test key={0} />)}
              </div>
            </div>

          </div>


          <div className="m-1 border border-neutral-200 rounded-xl p-1">
            {[0, 0, 0].map(el => <h1 className="p-2 rounded-full border border-neutral-200 inline-block m-1 "> Tag </h1>)}
          </div>

        </div>



      </div>

    </div>
  )

}
