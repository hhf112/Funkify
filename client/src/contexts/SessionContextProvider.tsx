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
  sessionToken: string,
  user: User | null,
  setSessionToken: Dispatch<SetStateAction<string>>,
  setUser: Dispatch<SetStateAction<User | null>>,
  getSessionToken: () => Promise<void>,
  doRefreshToken: () => Promise<void>,
  Fetch: (ur: string, opts: any) => Promise<Response | null>,
  Logout: () => Promise<void>,
}

export const sessionContext = createContext<sessionContextType>({
  user: null,
  sessionToken: "",
  setUser: () => { },
  setSessionToken: () => { },
  getSessionToken: async () => { },
  doRefreshToken: async () => { },
  Fetch: async (url: string, opts: any) => null,
  Logout: async () => { },
});

export function SessionContextProvider(
  { children }: { children: React.ReactNode }) {

  //
  const navigate = useNavigate();
  // states
  const [sessionToken, setSessionToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  /* state functions */

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
      setSessionToken("");
    } catch (err) {
      console.log(err);
    }
  }


  async function getSessionToken(): Promise<void> {
    if (!user) {
      console.log("user is not valid. cannot fetch session token");
      return;
    }
    if (user.email == "" || user.password == "") return;
    try {
      const post: Response = await fetch(`${authentication}/login`, {
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
    const get: Response = await fetch(`${authentication}/token`);
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
      Logout,
    }}>

      {children}
    </sessionContext.Provider>
  )
}
