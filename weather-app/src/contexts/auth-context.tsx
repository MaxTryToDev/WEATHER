import React, { createContext, useState } from "react";

type AuthData = {
	email: string;
	token: string;
} | null;

type AuthState = {
	data: AuthData;
};

export const AuthContext = createContext<{
	auth: AuthState;
	setAuthData: (data: AuthData) => void;
}>({
	auth: { data: null },
	setAuthData: (data) => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const authData = localStorage.getItem("auth");
	const initialAuth = authData
		? { data: JSON.parse(authData) }
		: { data: null };

	const [auth, setAuth] = useState<AuthState>(initialAuth);

	const setAuthData = (data: any) => {
		setAuth({ data: data });
		localStorage.setItem("auth", JSON.stringify(data));
	};

	return (
		<AuthContext.Provider value={{ auth, setAuthData }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
