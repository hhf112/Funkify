
export function Login() {
  return (
    <div className="flex h-screen justify-center items-center">
      <form className="relative flex flex-col w-2/5 h-3/5 items-center justify-center border border-neutral-500 shadow-xl p-20">

        <div className="prose prose-sm absolute left-0 top-0 m-4">
          <h3 className="text-neutral-700"> Don't have an account? 
            <a className = "text-amber-300 font-semibold cursor-pointer">
               Sign up today!
              </a> 
              </h3>
        </div>

        <img src="/unlock.png" className = "animate-bounce w-15 h-15 object-fill m-2"/>
   
        <h3 className="text-neutral-700 my-2 font-semibold"> Login is required to access further content </h3>
         
        <div className="flex items-stretch h-12">
          <label htmlFor="email" />
          <img src="/mail.png" className="   mx-1" />
          <input type="email" id="email " placeholder="your email goes here" className="w-65 p-4 border border-neutral-500 my-1 mx-1" />
        </div>


        <div className="flex items-stretch h-12">
          <label htmlFor="password" />
          <img src="/globe.png" className="   mx-1" />
          <input type="email" id="email " placeholder="your email goes here" className="w-65  p-4 border border-neutral-500 my-1 mx-1" />
        </div>


        <button type="submit"
          className="cursor-pointer hover:bg-neutral-500 my-4 text-lg border border-neutral-700 bg-neutral-800 text-neutral-100 p-3 
          shadow-neutral-500 shadow-lg">
          Login
        </button>
      </form>
    </div>
  )

}
