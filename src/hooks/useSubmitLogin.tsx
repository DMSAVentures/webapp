import { useState } from "react";

interface ErrorResponse {
	code: string;
	message: string;
}

interface LoginData {
	token: string;
}

const isErrorResponse = (error: any): error is ErrorResponse => {
	return typeof error === "object" && "code" in error && "message" in error;
};

const isLoginData = (data: any): data is LoginData => {
	return typeof data === "object" && "token" in data;
};

interface SubmitLoginOperation {
	submitLogin: (email: string, password: string) => Promise<void>;
	loading: boolean;
	error: ErrorResponse | null;
	data: LoginData | null;
}

export const useSubmitLogin = (): SubmitLoginOperation => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const [data, setData] = useState<LoginData | null>(null);

	const submitLogin = async (
		email: string,
		password: string,
	): Promise<void> => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/login/email`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				},
			);

			if (!response.ok) {
				const errorData: ErrorResponse = await response.json();
				if (isErrorResponse(errorData)) {
					throw new Error(errorData.message || "Login failed");
				} else {
					throw new Error("unknown response received");
				}
			} else {
				const responseData: LoginData = await response.json();
				if (isLoginData(responseData)) {
					setData(responseData);
				}
			}
		} catch (error: any) {
			console.error("Login failed", error);
			if (error instanceof Error) {
				setError({ code: "unknown_error", message: error.message });
			} else {
				setError({
					code: "unknown_error",
					message: "An error occurred during login",
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return { submitLogin, loading, error, data };
};
