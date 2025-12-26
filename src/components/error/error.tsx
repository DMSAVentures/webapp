import { ErrorComponentProps } from "@tanstack/react-router";
import React from "react";
import { Button } from "@/proto-design-system/Button/button";
import { Column } from "@/proto-design-system/UIShell/Column/Column";
import styles from "./error.module.scss";

interface ErrorStateProps {
	message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = (
	props: ErrorStateProps,
) => {
	return (
		<Column
			sm={{ span: 7, start: 1 }}
			md={{ start: 1, span: 7 }}
			lg={{ start: 1, span: 11 }}
			xlg={{ start: 1, span: 13 }}
		>
			<p>{props.message}</p>
		</Column>
	);
};

/**
 * ErrorBoundary Component
 *
 * A full-height error boundary component for TanStack Router.
 * Displays error details and provides recovery actions.
 */
export const ErrorBoundary: React.FC<ErrorComponentProps> = ({
	error,
	reset,
}) => {
	const isDev = import.meta.env.DEV;
	const errorMessage =
		error instanceof Error ? error.message : "An unexpected error occurred";
	const errorStack = error instanceof Error ? error.stack : undefined;

	const handleGoHome = () => {
		window.location.href = "/";
	};

	return (
		<div className={styles.root}>
			<div className={styles.container}>
				<div className={styles.iconWrapper}>
					<i
						className={`ri-error-warning-line ${styles.icon}`}
						aria-hidden="true"
					/>
				</div>

				<h1 className={styles.title}>Something went wrong</h1>

				<p className={styles.message}>{errorMessage}</p>

				{isDev && errorStack && (
					<details className={styles.details}>
						<summary className={styles.summary}>Stack trace</summary>
						<pre className={styles.stack}>{errorStack}</pre>
					</details>
				)}

				<div className={styles.actions}>
					{reset && (
						<Button onClick={reset} leftIcon="refresh-line">
							Try again
						</Button>
					)}
					<Button
						variant="secondary"
						onClick={handleGoHome}
						leftIcon="home-line"
					>
						Go to home
					</Button>
				</div>
			</div>
		</div>
	);
};
