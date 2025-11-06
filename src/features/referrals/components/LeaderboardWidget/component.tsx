import { HTMLAttributes, memo, useCallback, useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/types/common.types";
import styles from "./component.module.scss";
import "remixicon/fonts/remixicon.css";

/**
 * Props for the LeaderboardWidget component
 */
export interface LeaderboardWidgetProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign ID to fetch leaderboard for */
	campaignId: string;
	/** Number of top users to display (default: 10) */
	limit?: number;
	/** Time period for leaderboard */
	period?: "all_time" | "daily" | "weekly" | "monthly";
	/** User ID to highlight in the leaderboard */
	highlightUserId?: string;
	/** Polling interval in milliseconds (default: 10000) */
	pollingInterval?: number;
	/** Function to fetch leaderboard data */
	fetchLeaderboard?: (
		campaignId: string,
		period: string,
		limit: number,
	) => Promise<LeaderboardEntry[]>;
	/** Initial leaderboard data (for testing/storybook) */
	initialData?: LeaderboardEntry[];
	/** Additional CSS class name */
	className?: string;
}

/**
 * Badge configuration
 */
const badgeIcons: Record<string, string> = {
	top_referrer: "ri-trophy-fill",
	early_bird: "ri-time-fill",
	influencer: "ri-star-fill",
	champion: "ri-medal-fill",
	rising_star: "ri-rocket-fill",
	consistent: "ri-fire-fill",
};

/**
 * Get rank display with medal for top 3
 */
const getRankDisplay = (rank: number): { display: string; icon?: string } => {
	switch (rank) {
		case 1:
			return { display: "1st", icon: "ri-medal-fill" };
		case 2:
			return { display: "2nd", icon: "ri-medal-2-fill" };
		case 3:
			return { display: "3rd", icon: "ri-medal-fill" };
		default:
			return { display: `${rank}${getRankSuffix(rank)}` };
	}
};

const getRankSuffix = (rank: number): string => {
	const j = rank % 10;
	const k = rank % 100;
	if (j === 1 && k !== 11) return "st";
	if (j === 2 && k !== 12) return "nd";
	if (j === 3 && k !== 13) return "rd";
	return "th";
};

/**
 * LeaderboardWidget component - Display top referrers with real-time updates
 *
 * Features:
 * - Fetch and display leaderboard data
 * - Show top N users (default 10)
 * - Columns: Rank, Name, Referrals, Points, Badges
 * - Highlight current user row (if in top N)
 * - Badge icons for achievements
 * - Poll every 10 seconds for updates
 * - Animate rank changes
 */
export const LeaderboardWidget = memo(function LeaderboardWidget({
	campaignId,
	limit = 10,
	period = "all_time",
	highlightUserId,
	pollingInterval = 10000,
	fetchLeaderboard,
	initialData = [],
	className: customClassName,
	...props
}: LeaderboardWidgetProps) {
	const [leaderboardData, setLeaderboardData] =
		useState<LeaderboardEntry[]>(initialData);
	const [loading, setLoading] = useState(false);
	const [rankChanges, setRankChanges] = useState<Record<string, "up" | "down">>(
		{},
	);

	// Fetch leaderboard data
	const loadLeaderboard = useCallback(async () => {
		if (!fetchLeaderboard) return;

		try {
			setLoading(true);
			const data = await fetchLeaderboard(campaignId, period, limit);

			// Detect rank changes
			const changes: Record<string, "up" | "down"> = {};
			data.forEach((entry) => {
				const oldEntry = leaderboardData.find((e) => e.userId === entry.userId);
				if (oldEntry && oldEntry.rank !== entry.rank) {
					changes[entry.userId] = entry.rank < oldEntry.rank ? "up" : "down";
				}
			});

			setRankChanges(changes);
			setLeaderboardData(data);

			// Clear rank change indicators after animation
			setTimeout(() => setRankChanges({}), 2000);
		} catch (error) {
			console.error("Failed to fetch leaderboard:", error);
		} finally {
			setLoading(false);
		}
	}, [campaignId, period, limit, fetchLeaderboard, leaderboardData]);

	// Set up polling
	useEffect(() => {
		if (!fetchLeaderboard) return;

		// Initial load
		loadLeaderboard();

		// Set up polling interval
		const interval = setInterval(loadLeaderboard, pollingInterval);

		return () => clearInterval(interval);
	}, [loadLeaderboard, pollingInterval, fetchLeaderboard]);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<div className={classNames} {...props}>
			<div className={styles.container}>
				{/* Header */}
				<div className={styles.header}>
					<h3 className={styles.title}>
						<i className="ri-bar-chart-fill" aria-hidden="true" />
						Leaderboard
					</h3>
					<div className={styles.periodSelector}>
						<span className={styles.periodLabel}>
							{period === "all_time" && "All Time"}
							{period === "daily" && "Today"}
							{period === "weekly" && "This Week"}
							{period === "monthly" && "This Month"}
						</span>
						{loading && (
							<i
								className={`${styles.loadingIcon} ri-refresh-line`}
								aria-hidden="true"
							/>
						)}
					</div>
				</div>

				{/* Leaderboard Table */}
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th className={styles.rankColumn}>Rank</th>
								<th className={styles.nameColumn}>Name</th>
								<th className={styles.referralsColumn}>Referrals</th>
								<th className={styles.pointsColumn}>Points</th>
								<th className={styles.badgesColumn}>Badges</th>
							</tr>
						</thead>
						<tbody>
							{leaderboardData.map((entry) => {
								const isHighlighted = entry.userId === highlightUserId;
								const rankChange = rankChanges[entry.userId];
								const rankDisplay = getRankDisplay(entry.rank);

								return (
									<tr
										key={entry.userId}
										className={`
                                            ${styles.row}
                                            ${isHighlighted ? styles.highlighted : ""}
                                            ${rankChange ? styles[`rankChange_${rankChange}`] : ""}
                                        `}
									>
										<td className={styles.rankCell}>
											<div className={styles.rankDisplay}>
												{rankDisplay.icon && (
													<i
														className={`${styles.rankIcon} ${rankDisplay.icon}`}
														aria-hidden="true"
													/>
												)}
												<span className={styles.rankNumber}>
													{rankDisplay.display}
												</span>
												{rankChange && (
													<i
														className={`${styles.changeIcon} ${
															rankChange === "up"
																? "ri-arrow-up-line"
																: "ri-arrow-down-line"
														}`}
														aria-hidden="true"
													/>
												)}
											</div>
										</td>
										<td className={styles.nameCell}>
											<span className={styles.userName}>{entry.name}</span>
											{isHighlighted && (
												<span className={styles.youBadge}>You</span>
											)}
										</td>
										<td className={styles.referralsCell}>
											{entry.referralCount.toLocaleString()}
										</td>
										<td className={styles.pointsCell}>
											{entry.points.toLocaleString()}
										</td>
										<td className={styles.badgesCell}>
											<div className={styles.badgeList}>
												{entry.badges.map((badge) => (
													<i
														key={badge}
														className={`${styles.badgeIcon} ${badgeIcons[badge] || "ri-award-fill"}`}
														title={badge.replace("_", " ")}
														aria-label={badge.replace("_", " ")}
													/>
												))}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					{/* Empty State */}
					{leaderboardData.length === 0 && !loading && (
						<div className={styles.emptyState}>
							<i className="ri-trophy-line" aria-hidden="true" />
							<p>No leaderboard data yet</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
});

LeaderboardWidget.displayName = "LeaderboardWidget";
