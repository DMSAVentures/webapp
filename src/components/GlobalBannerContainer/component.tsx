import { AnimatePresence, motion } from "motion/react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import Banner from "@/proto-design-system/banner/banner";
import styles from "./component.module.scss";

export function GlobalBannerContainer() {
	const { banners, dismissBanner } = useGlobalBanner();

	if (banners.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			<AnimatePresence mode="popLayout">
				{banners.map((banner) => (
					<motion.div
						key={banner.id}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className={styles.bannerWrapper}
					>
						<Banner
							bannerType={banner.type}
							variant="filled"
							alertTitle={banner.title}
							alertDescription={banner.description || ""}
							dismissible={banner.dismissible}
							onDismiss={() => dismissBanner(banner.id)}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
