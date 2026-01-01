import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BlastWizard } from "@/features/blasts/components/BlastWizard/component";
import styles from "./index.module.scss";

interface BlastNewSearch {
	segmentId?: string;
}

export const Route = createFileRoute("/blasts/new")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): BlastNewSearch => ({
		segmentId: (search.segmentId as string) || undefined,
	}),
});

function RouteComponent() {
	const { segmentId } = Route.useSearch();

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<BlastWizard segmentId={segmentId} />
		</motion.div>
	);
}
