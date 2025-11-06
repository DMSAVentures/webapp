import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import styles from "./page.module.scss";

export const Route = createFileRoute("/campaigns")({
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
				<h1 className={styles.pageTitle}>Campaigns</h1>
				<p className={styles.pageDescription}>
					Manage your marketing campaigns and promotional activities
				</p>
			</div>

			<div className={styles.pageContent}>
				{/* Campaign components will go here */}
				<p>Campaign management coming soon...</p>
			</div>
		</motion.div>
	);
}
