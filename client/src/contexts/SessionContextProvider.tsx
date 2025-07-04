import React, { createContext, useState, type Dispatch, type SetStateAction } from "react";

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
}
export interface sessionContextType {
  sessionToken: string,
  user: User,
  setSessionToken: Dispatch<SetStateAction<string>>,
  setUser: Dispatch<SetStateAction<User>>,
  getSessionToken: () => Promise<void>,
  doRefreshToken: () => Promise<void>,
}

export const sessionContext = createContext<sessionContextType>({
  sessionToken: "",
  user: {
    isValid: true,
    username: "",
    password: "",
    email: "",
    userId: "",
  },
  setUser: () => { },
  setSessionToken: () => { },
  getSessionToken: async () => { },
  doRefreshToken: async () => { }
});

export function SessionContextProvider(
  { children }: { children: React.ReactNode }) {

  // states
  const [sessionToken, setSessionToken] = useState<string>("");
  const [user, setUser] = useState<User>({
    isValid: true,
    username: "test",
    password: "test",
    email: "test",
    userId: "test",
  })

  /* funcs */
  async function getSessionToken(): Promise<void> {
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
    try {
      const get: Response = await fetch(`http://localhost:5000/token`);
      const getJSON = await get.json();
      const token = getJSON.accessToken;
      setSessionToken(token);
    } catch (err) {
      console.error(err);
    }
    return;
  }



  return (
    <sessionContext.Provider value={{
      sessionToken,
      user,
      setUser,
      setSessionToken,
      getSessionToken,
      doRefreshToken,
    }}>

      {children}
    </sessionContext.Provider>
  )
}
