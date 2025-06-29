import React, { createContext, useState, type Dispatch, type SetStateAction } from "react";
const backend = import.meta.env.VITE_BACKEND;

// interfaces
export interface User {
  isValid: Boolean,
  username: String | null,
  password: String | null,
  email: String | null,
}
export interface sessionContextType {
  sessionToken: string,
  user: User,
  setSessionToken: Dispatch<SetStateAction<string>>,
  setUser: Dispatch<SetStateAction<User>>,
  getSessionToken: () => Promise<void>,

}
export const sessionContext = createContext<sessionContextType>({
  sessionToken: "",
  user: ({
    isValid: false,
    username: "",
    password: "",
    email: "",
  }),
  setUser: () => { },
  setSessionToken: () => { },
  getSessionToken: async () => { },

});

export function SessionContextProvider(
  { children }: { children: React.ReactNode }) {

  // states
  const [sessionToken, setSessionToken] = useState<string>("");
  const [user, setUser] = useState<User>({
    isValid: false,
    username: "",
    password: "",
    email: "",
  })

  /* funcs */
  async function getSessionToken(): Promise<void> {
    try {
      const get: Response = await fetch(`${backend}/token`);
      const getJSON = await get.json();
      const token = getJSON.accessToken;

      setSessionToken(token);
    } catch (err) {
      // redirect to login page.
    }

  }

  return (
    <sessionContext.Provider value={{
      sessionToken,
      user,
      setUser,
      setSessionToken,
      getSessionToken,
    }}>

      {children}
    </sessionContext.Provider>
  )
}
