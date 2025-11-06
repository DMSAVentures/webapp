import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import styles from "./page.module.scss";

export const Route = createFileRoute("/articles")({
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
				<h1 className={styles.pageTitle}>Articles</h1>
				<p className={styles.pageDescription}>
					Create and manage your content articles
				</p>
			</div>

			<div className={styles.pageContent}>
				{/* Articles components will go here */}
				<p>Article editor coming soon...</p>
			</div>
		</motion.div>
	);
}
