import React, { createContext, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

const authentication = import.meta.env.VITE_AUTH;
if (!authentication) {
  console.error("authentication url not found");
  process.exit(1);
}

// interfaces
export interface User {
  // isValid: Boolean,
  _id: string,
  username: string,
  password: string,
  email: string,
  userId: string,
  attempted: {
    id: string,
    status: string,
  }[],
}

export interface problem {
  title: string,
  description: string,
  difficulty: string,
  tags: string[],
  createdAt: Date,
  author: string,
  userId: string,
  sampleTests: {
    input: string,
    output: string,
  }[],
  constraints: {
    memory_md: number,
    runtime_s: number,
  },
  testSolution: string,
  testId: string,
  linesPerTestCase: number,
}
export interface sessionContextType {
  sessionToken: string | null,
  user: User | null,
  setSessionToken: Dispatch<SetStateAction<string | null>>,
  setUser: Dispatch<SetStateAction<User | null>>,
  Fetch: (ur: string, opts: any) => Promise<Response | null>,
  Logout: () => Promise<void>,
}

export const sessionContext = createContext<sessionContextType>({
  user: null,
  sessionToken: "",
  setUser: () => { },
  setSessionToken: () => { },
  Fetch: async (url: string, opts: any) => null,
  Logout: async () => { },
});

export function SessionContextProvider(
  { children }: { children: React.ReactNode }) {

  //
  const navigate = useNavigate();
  // states
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // console.log(sessionToken);

  /* state functions */


  async function Logout() {
    try {
      const post = await fetch(`${authentication}/logout`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include"
      })
      const postJSON = await post.json();
      // console.log(postJSON);
      setSessionToken(null);
    } catch (err) {
      console.log(err);
    }
  }


  async function Fetch(url: string, opts: any): Promise<Response | null> {
    if (!sessionToken) return null;
    let opt = await fetch(url, opts);
    if (opt.status === 401) {
      const post: Response = await fetch(`${authentication}/token`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include"
      });
      if (!post.ok) return null;
      const postJSON = await post.json();
      const token = postJSON.accessToken;
      setSessionToken(token);
      opts.headers = { ...opts.headers, authorization: `Bearer ${token}` };
      opt = await fetch(url, opts);
    }
    return opt;
  }


  return (
    <sessionContext.Provider value={{
      sessionToken,
      user,
      setUser,
      setSessionToken,
      Fetch,
      Logout,
    }}>

      {children}
    </sessionContext.Provider>
  )
}
