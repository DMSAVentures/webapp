import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BlastDetail } from "@/features/blasts/components/BlastDetail/component";
import styles from "./index.module.scss";

export const Route = createFileRoute("/blasts/$blastId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { blastId } = Route.useParams();

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<BlastDetail blastId={blastId} />
		</motion.div>
	);
}
