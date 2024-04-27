import React, { useReducer } from "react";

type EmailFormErrors = {
    email?: string;
    password?: string;
    [key: string]: string | undefined;
};
type EmailFormState = {
    email: string;
    password: string;
    errors: EmailFormErrors
    isSubmitting: boolean;
};
// Define the initial state for the form
const initialState: EmailFormState = {
    email: "",
    password: "",
    errors: {} as EmailFormErrors,
    isSubmitting: false,
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
        case EmailFormAction.SUBMIT_FORM:
            return {
                ...state,
                isSubmitting: true,
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

    // Handle form submission
    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
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

            // Simulate a form submission with a timeout
            setTimeout(() => {
                console.log("Form submission successful!");
                dispatch({ type: EmailFormAction.RESET_FORM });
            }, 2000); // Simulate form processing time
        }
    }

    return (
        <div>
            <h1>Sign in with Email</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        formNoValidate={true}
                        value={state.email}
                        onChange={(e) =>
                            dispatch({
                                type: EmailFormAction.SET_FIELD,
                                field: "email",
                                value: e.target.value,
                            })
                        }
                    />
                    {state.errors.email && (
                        <span style={{ color: "red" }}>{state.errors.email}</span>
                    )}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={state.password}
                        onChange={(e) =>
                            dispatch({
                                type: EmailFormAction.SET_FIELD,
                                field: "password",
                                value: e.target.value,
                            })
                        }
                    />
                    {state.errors.password && (
                        <span style={{ color: "red" }}>{state.errors.password}</span>
                    )}
                </div>
                <button type="submit" disabled={state.isSubmitting}>
                    {state.isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}
