import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/auth";
import { usePersona } from "@/contexts/persona";
import cardStyles from "./dashboard.module.scss";
import styles from "./page.module.scss";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { persona, getNavigationGroups } = usePersona();
	const { user } = useAuth();
	const navigationGroups = getNavigationGroups();

	// Get persona-specific welcome message
	const getWelcomeMessage = () => {
		switch (persona) {
			case "admin":
				return "You have full access to all features and settings.";
			case "marketing":
				return "Access your analytics, campaigns, and email marketing tools.";
			case "developer":
				return "Manage your API keys, webhooks, and technical integrations.";
			case "sales":
				return "Track your deals, manage contacts, and view analytics.";
			case "content_creator":
				return "Create and manage articles and media content.";
			case "viewer":
				return "You have read-only access to the application.";
			default:
				return "Welcome to the dashboard.";
		}
	};

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<h1 className={styles.pageTitle}>
					Welcome back, {user?.firstName || "User"}!
				</h1>
				<p className={styles.pageDescription}>{getWelcomeMessage()}</p>
			</div>

			<div className={cardStyles.dashboard}>
				<div className={cardStyles.quickAccess}>
					<h2 className={cardStyles.sectionTitle}>Quick Access</h2>
					<div className={cardStyles.cardGrid}>
						{navigationGroups.map((group) =>
							group.items.map((item) => (
								<Link
									key={item.href}
									to={item.href}
									className={cardStyles.card}
								>
									<i className={`ri-${item.iconClass}`} aria-hidden="true" />
									<span className={cardStyles.cardLabel}>{item.label}</span>
								</Link>
							)),
						)}
					</div>
				</div>

				<div className={cardStyles.personaInfo}>
					<h2 className={cardStyles.sectionTitle}>Your Role</h2>
					<div className={cardStyles.personaBadge}>
						<span className={cardStyles.personaLabel}>
							{persona.replace("_", " ").toUpperCase()}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
