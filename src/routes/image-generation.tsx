import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import ImageGenBox from "@/components/ai/imagegenbox";

export const Route = createFileRoute("/image-generation")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<ImageGenBox />
		</motion.div>
	);
}
