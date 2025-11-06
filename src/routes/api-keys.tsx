import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import styles from "./page.module.scss";

export const Route = createFileRoute("/api-keys")({
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
				<h1 className={styles.pageTitle}>API Keys</h1>
				<p className={styles.pageDescription}>
					Manage your API keys and access tokens
				</p>
			</div>

			<div className={styles.pageContent}>
				{/* API keys components will go here */}
				<p>API key management coming soon...</p>
			</div>
		</motion.div>
	);
}
