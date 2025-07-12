// context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/User";
import { get } from "../utils/apiClient";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>();

	useEffect(() => {
		const getUser = async () => {
			const token = localStorage.getItem('token')
			if (token) {
				const res = await get('/user', undefined);
				if (!res.error) {
					setUser(res);
				}
			}
		}
		getUser();
		
	}, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
