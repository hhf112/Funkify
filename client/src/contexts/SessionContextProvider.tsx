import React, { createContext, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

// interfaces
export interface User {
  isValid: Boolean,
  username: string | null,
  password: string | null,
  email: string | null,
  userId: string,
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
  sessionToken: string,
  user: User,
  setSessionToken: Dispatch<SetStateAction<string>>,
  setUser: Dispatch<SetStateAction<User>>,
  getSessionToken: () => Promise<void>,
  doRefreshToken: () => Promise<void>,
  Fetch: (ur: string, opts: any) => Promise<Response | null>,
}

export const sessionContext = createContext<sessionContextType>({
  user: {
    isValid: true,
    username: "",
    password: "",
    email: "",
    userId: "",
  },
  sessionToken: "",
  setUser: () => { },
  setSessionToken: () => { },
  getSessionToken: async () => { },
  doRefreshToken: async () => { },
  Fetch: async (url: string, opts: any) => null,
});

export function SessionContextProvider(
  { children }: { children: React.ReactNode }) {

  //
  const navigate = useNavigate();
  // states
  const [sessionToken, setSessionToken] = useState<string>("");
  const [user, setUser] = useState<User>({
    isValid: true,
    username: "test",
    password: "test",
    email: "test",
    userId: "6864d87ecae8dcff198a5bff",

  })

  /* state funcs */
  async function Fetch(url: string, opts: any): Promise<Response> {
    const { headers = {}, ...rest } = opts;
    const authHeaders = {
      ...headers,
      authorization: `Bearer ${sessionToken}`,
    }
    const authOpts = { ...rest, headers: authHeaders }
    let opt = await fetch(url, authOpts);
    if (opt.status === 401) {
      await doRefreshToken();
      opt = await fetch(url, authOpts);
    }
    return opt;
  }

  async function getSessionToken(): Promise<void> {
    if (!user) {
      console.log("user is not valid. cannot fetch session token");
      return;
    }
    if (user.email == "" || user.password == "") return;
    try {
      const post: Response = await fetch(`http://localhost:5000/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email || "",
          password: user.password || "",
        }),
      });
      const postJSON = await post.json();
      const token = postJSON.accessToken;
      setSessionToken(token);
    } catch (err) {
      console.error(err);
    }
    return;
  }

  async function doRefreshToken(): Promise<void> {
    const get: Response = await fetch(`http://localhost:5000/token`);
    const getJSON = await get.json();
    const token = getJSON.accessToken;
    setSessionToken(token);
  }

  return (
    <sessionContext.Provider value={{
      sessionToken,
      user,
      setUser,
      setSessionToken,
      getSessionToken,
      doRefreshToken,
      Fetch,
    }}>

      {children}
    </sessionContext.Provider>
  )
}
