import { memo } from "react";
import styles from "./LoadingSpinner.module.scss";

export interface LoadingSpinnerProps {
	/** Size of the spinner */
	size?: "small" | "medium" | "large";
	/** Display mode */
	mode?: "inline" | "centered" | "fullscreen";
	/** Optional message to display below spinner */
	message?: string;
	/** Additional CSS class name */
	className?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({
	size = "medium",
	mode = "centered",
	message,
	className: customClassName,
}: LoadingSpinnerProps) {
	const classNames = [styles.root, styles[`mode_${mode}`], customClassName]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classNames} role="status" aria-live="polite">
			<div className={`${styles.spinner} ${styles[`size_${size}`]}`} />
			{message && <p className={styles.message}>{message}</p>}
			<span className={styles["visually-hidden"]}>Loading...</span>
		</div>
	);
});

LoadingSpinner.displayName = "LoadingSpinner";
