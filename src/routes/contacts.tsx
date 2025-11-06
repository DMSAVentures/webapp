import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import styles from "./page.module.scss";

export const Route = createFileRoute("/contacts")({
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
				<h1 className={styles.pageTitle}>Contacts</h1>
				<p className={styles.pageDescription}>
					Manage your business contacts and relationships
				</p>
			</div>

			<div className={styles.pageContent}>
				{/* Contacts components will go here */}
				<p>Contact management coming soon...</p>
			</div>
		</motion.div>
	);
}
