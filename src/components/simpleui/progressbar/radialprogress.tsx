import React from "react";
import styles from "./radialprogress.module.scss";

interface Radialprogress {
	percentage: number;
	size: "x-small" | "small" | "medium" | "large";
	variant: "success" | "warning" | "error" | "info";
	showPercentage: boolean;
}

const RadialProgress: React.FC<Radialprogress> = (props) => {
	const clampedPercentage = Math.min(100, Math.max(0, props.percentage));

	return (
		<div
			className={`${styles["radial-progress"]} ${styles[`radial-progress--${props.size}`]} ${styles[`radial-progress--${props.variant}`]}`}
			style={
				{
					"--progress-percentage": `${clampedPercentage}%`,
				} as React.CSSProperties & { [key: string]: string | number }
			}
		>
			<div className={styles["center-content"]}>
				{props.showPercentage ? (
					<span className={styles["percentage_text"]}>
						{clampedPercentage}%
					</span>
				) : null}
			</div>
		</div>
	);
};

export default RadialProgress;
