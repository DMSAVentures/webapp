import { ArrowUp, RefreshCw, Trophy } from "lucide-react";
import { HTMLAttributes, memo, useCallback, useEffect, useState } from "react";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import { formatPositionWithLocale } from "@/utils/positionFormatter";
import styles from "./component.module.scss";

/**
 * Props for the PositionTracker component
 */
export interface PositionTrackerProps extends HTMLAttributes<HTMLDivElement> {
	/** User ID to track position for */
	userId: string;
	/** Polling interval in milliseconds (default: 10000) */
	pollingInterval?: number;
	/** Function to fetch position data */
	fetchPosition?: (userId: string) => Promise<PositionData>;
	/** Initial position data (for testing/storybook) */
	initialPosition?: PositionData;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Position data structure
 */
export interface PositionData {
	position: number;
	totalUsers: number;
	percentile: number;
}

/**
 * Calculate percentile from position and total
 */
const calculatePercentile = (position: number, total: number): number => {
	if (total === 0) return 0;
	return Math.round(((total - position + 1) / total) * 100);
};

/**
 * PositionTracker component - Live position display with animations
 *
 * Features:
 * - Display current position (#123)
 * - Show total waitlist size ("of 5,432")
 * - Percentile ("Top 2%")
 * - Poll every 10 seconds
 * - Animate when position improves
 * - Show confetti on big improvement (>10 spots)
 */
export const PositionTracker = memo(function PositionTracker({
	userId,
	pollingInterval = 10000,
	fetchPosition,
	initialPosition = { position: 0, totalUsers: 0, percentile: 0 },
	className: customClassName,
	...props
}: PositionTrackerProps) {
	const [positionData, setPositionData] =
		useState<PositionData>(initialPosition);
	const [previousPosition, setPreviousPosition] = useState<number>(
		initialPosition.position,
	);
	const [showImprovement, setShowImprovement] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [loading, setLoading] = useState(false);

	// Fetch position data
	const loadPosition = useCallback(async () => {
		if (!fetchPosition) return;

		try {
			setLoading(true);
			const data = await fetchPosition(userId);

			// Check if position improved
			if (data.position < previousPosition && previousPosition > 0) {
				const improvement = previousPosition - data.position;
				setShowImprovement(true);

				// Show confetti on big improvement (>10 spots)
				if (improvement > 10) {
					setShowConfetti(true);
					setTimeout(() => setShowConfetti(false), 3000);
				}

				setTimeout(() => setShowImprovement(false), 2000);
			}

			setPreviousPosition(positionData.position);
			setPositionData(data);
		} catch (error) {
			console.error("Failed to fetch position:", error);
		} finally {
			setLoading(false);
		}
	}, [userId, fetchPosition, previousPosition, positionData.position]);

	// Set up polling
	useEffect(() => {
		if (!fetchPosition) return;

		// Initial load
		loadPosition();

		// Set up polling interval
		const interval = setInterval(loadPosition, pollingInterval);

		return () => clearInterval(interval);
	}, [loadPosition, pollingInterval, fetchPosition]);

	const classNames = [
		styles.root,
		showImprovement && styles.improving,
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	const percentile =
		positionData.percentile ||
		calculatePercentile(positionData.position, positionData.totalUsers);

	return (
		<div className={classNames} {...props}>
			{/* Confetti Animation */}
			{showConfetti && (
				<div className={styles.confettiContainer}>
					{Array.from({ length: 50 }).map((_, i) => (
						<div
							key={i}
							className={styles.confetti}
							style={{
								left: `${Math.random() * 100}%`,
								animationDelay: `${Math.random() * 0.5}s`,
								backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
							}}
						/>
					))}
				</div>
			)}

			<div className={styles.container}>
				{/* Position Display */}
				<div className={styles.positionSection}>
					<div className={styles.positionLabel}>Your Position</div>
					<div className={styles.positionDisplay}>
						<span className={styles.positionNumber}>
							{formatPositionWithLocale(positionData.position)}
						</span>
						{showImprovement && (
							<Stack direction="row" gap="xs" align="center" className={styles.improvementBadge}>
								<Icon icon={ArrowUp} size="sm" />
								<Text size="sm">Improved!</Text>
							</Stack>
						)}
					</div>
					<div className={styles.totalUsers}>
						of {positionData.totalUsers.toLocaleString()} people
					</div>
				</div>

				{/* Percentile Badge */}
				<div className={styles.percentileSection}>
					<Stack direction="row" gap="xs" align="center" className={styles.percentileBadge}>
						<Icon icon={Trophy} size="sm" />
						<Text size="sm" weight="medium" className={styles.percentileText}>Top {percentile}%</Text>
					</Stack>
				</div>

				{/* Loading Indicator */}
				{loading && (
					<div className={styles.loadingIndicator}>
						<Icon icon={RefreshCw} size="sm" color="muted" />
					</div>
				)}
			</div>
		</div>
	);
});

PositionTracker.displayName = "PositionTracker";
