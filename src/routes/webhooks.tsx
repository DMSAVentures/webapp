import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import styles from "./page.module.scss";

export const Route = createFileRoute("/webhooks")({
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
				<h1 className={styles.pageTitle}>Webhooks</h1>
				<p className={styles.pageDescription}>
					Configure webhook endpoints and event notifications
				</p>
			</div>

			<div className={styles.pageContent}>
				{/* Webhooks components will go here */}
				<p>Webhook configuration coming soon...</p>
			</div>
		</motion.div>
	);
}
