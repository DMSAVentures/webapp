import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import styles from "./page.module.scss";

export const Route = createFileRoute("/analytics")({
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
				<h1 className={styles.pageTitle}>Analytics</h1>
				<p className={styles.pageDescription}>
					Track your marketing performance and campaign metrics
				</p>
			</div>

			<div className={styles.pageContent}>
				{/* Analytics components will go here */}
				<p>Analytics dashboard coming soon...</p>
			</div>
		</motion.div>
	);
}
