import React, { HTMLAttributes } from "react";
import styles from "./accordian.module.scss";
import "remixicon/fonts/remixicon.css";
import { AnimatePresence, motion } from "motion/react";

interface AccordianProps extends HTMLAttributes<HTMLDivElement> {
	flipIcon?: boolean;
	leftIcon?: string;
	title: string;
	description: string;
}

const Accordian: React.FC<AccordianProps> = ({
	flipIcon = false,
	leftIcon,
	title,
	description,
	children,
}) => {
	const [showContent, setShowContent] = React.useState(false);
	return (
		<motion.div
			onClick={() => setShowContent((prevShowContent) => !prevShowContent)}
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={
				showContent
					? `${styles.accordian} ${styles["accordian--show"]}`
					: styles.accordian
			}
		>
			{flipIcon ? (
				<i
					className={`${styles["accordian__icon"]} ${showContent ? "ri-subtract-line" : "ri-add-line"}`}
					onClick={() => setShowContent((prevShowContent) => !prevShowContent)}
				/>
			) : (
				leftIcon && (
					<i className={`${styles["accordian__icon"]} ri-${leftIcon}`} />
				)
			)}

			<div className={styles["accordian__title"]}>
				{title}
				<AnimatePresence initial={false}>
					{showContent && (
						<motion.div
							key="content"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3, ease: "easeIn" }}
							style={{ overflow: "hidden" }}
							className={styles["accordian__content"]}
						>
							{children}
							<p>{description}</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			{!flipIcon && (
				<i
					className={`${styles["accordian__icon"]} ${showContent ? "ri-subtract-line" : "ri-add-line"}`}
					onClick={() => setShowContent((prevShowContent) => !prevShowContent)}
				/>
			)}
		</motion.div>
	);
};

export default Accordian;
