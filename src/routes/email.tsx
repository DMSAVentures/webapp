import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import styles from "./page.module.scss";

export const Route = createFileRoute("/email")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<h1 className={styles.pageTitle}>Email Marketing</h1>
				<p className={styles.pageDescription}>
					Create and manage email campaigns for your audience
				</p>
			</div>

			<div className={styles.pageContent}>
				{/* Email marketing components will go here */}
				<p>Email marketing tools coming soon...</p>
			</div>
		</motion.div>
	);
}
