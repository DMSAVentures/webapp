import React, {useEffect, useReducer} from "react";
import {useSubmitLogin} from "@/hooks/useSubmitLogin";
import Button from "@/components/baseui/button/button";
import {TextInput} from "@/components/baseui/TextInput/textInput";

type EmailFormErrors = {
    email?: string;
    password?: string;
    [key: string]: string | undefined;
};
type EmailFormState = {
    email: string;
    password: string;
    errors: EmailFormErrors
};
// Define the initial state for the form
const initialState: EmailFormState = {
    email: "",
    password: "",
    errors: {} as EmailFormErrors,
};

// Define enum for EmailFormAction
enum EmailFormAction {
    SET_FIELD = "SET_FIELD",
    SET_ERROR = "SET_ERROR",
    SUBMIT_FORM = "SUBMIT_FORM",
    RESET_FORM = "RESET_FORM",
}
// Define reducer actions using the enum
type Action =
    | { type: EmailFormAction.SET_FIELD; field: string; value: string }
    | { type: EmailFormAction.SET_ERROR; field: string; error: string }
    | { type: EmailFormAction.SUBMIT_FORM }
    | { type: EmailFormAction.RESET_FORM };

// Reducer function to manage form state
function formReducer(state: EmailFormState, action: Action) {
    switch (action.type) {
        case EmailFormAction.SET_FIELD:
            return {
                ...state,
                [action.field]: action.value,
                errors: {
                    ...state.errors,
                    [action.field]: "", // Clear error when the field changes
                },
            };
        case EmailFormAction.SET_ERROR:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.field]: action.error,
                },
            };
        case EmailFormAction.RESET_FORM:
            return initialState; // Reset form state
        default:
            return state;
    }
}

// Email/Password login form component using useReducer
export default function EmailSignIn() {
    const [state, dispatch] = useReducer(formReducer, initialState);
    const { submitLogin, data, error, loading } = useSubmitLogin()

    useEffect(() => {
        if (data) {
            // Save token to local storage
            localStorage.setItem("token", data.token);
            // Redirect to home page using nextjs router
            window.location.href = "/";
        }
    }, [data]);

    // Handle form submission
    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const email = state.email.trim();
        const password = state.password.trim();

        let valid = true;
        const errors: EmailFormErrors = {
            email: "",
            password: "",
        }

        if (!email) {
            errors.email = "Email is required.";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Invalid email format.",
            valid = false;
        }

        if (!password) {
            errors.password = "Password is required.",
            valid = false;
        }

        // Set errors based on validation results
        Object.keys(errors).forEach((field) => {
            const error = errors[field] ?? "";
            if (error) {
                dispatch({
                    type: EmailFormAction.SET_ERROR,
                    field,
                    error: error,
                });
            }
        });

        if (valid) {
            dispatch({ type: EmailFormAction.SUBMIT_FORM });
            console.log("Form submitted:", { email, password });
            try {
                await submitLogin(email, password);
            } catch (error) {
                console.error("Login failed", error);
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div className={"form-item"}>
                    <TextInput id="email"
                               name="email"
                               type="text" label={'Email'} onChange={(e) =>
                        dispatch({
                            type: EmailFormAction.SET_FIELD,
                            field: "email",
                            value: e.target.value,
                        })
                    } error={state.errors.email} formNoValidate={true} />
                </div>
                <div className={"form-item"}>
                    <TextInput id="password"
                               name="password"
                               type="password" label={'Password'} onChange={(e) =>
                        dispatch({
                            type: EmailFormAction.SET_FIELD,
                            field: "email",
                            value: e.target.value,
                        })
                    } error={state.errors.password} />
                </div>
                {error && <div style={{ color: "red" }}>{error.message}</div>}
                <Button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        </div>
    );
}
