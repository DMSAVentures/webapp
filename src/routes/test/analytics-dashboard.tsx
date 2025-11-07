import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsDashboard } from "@/features/analytics/components/AnalyticsDashboard/component";
import type { Analytics } from "@/types/common.types";
import { useState } from "react";

export const Route = createFileRoute("/test/analytics-dashboard")({
	component: RouteComponent,
});

const mockAnalytics: Analytics = {
	overview: {
		totalSignups: 1250,
		todaySignups: 45,
		verificationRate: 87.5,
		viralCoefficient: 1.8,
		avgReferralsPerUser: 2.3,
	},
	funnel: [
		{ stage: "Visited", count: 5000, percentage: 100 },
		{ stage: "Signed Up", count: 1250, percentage: 25 },
		{ stage: "Verified", count: 1094, percentage: 21.88 },
		{ stage: "Referred", count: 875, percentage: 17.5 },
	],
	trafficSources: [
		{ source: "Twitter", count: 450, percentage: 36 },
		{ source: "Facebook", count: 375, percentage: 30 },
		{ source: "Direct", count: 250, percentage: 20 },
		{ source: "LinkedIn", count: 175, percentage: 14 },
	],
	timeline: [
		{ date: new Date("2024-01-01"), signups: 50, referrals: 20 },
		{ date: new Date("2024-01-02"), signups: 75, referrals: 35 },
		{ date: new Date("2024-01-03"), signups: 100, referrals: 55 },
		{ date: new Date("2024-01-04"), signups: 125, referrals: 80 },
		{ date: new Date("2024-01-05"), signups: 150, referrals: 110 },
	],
};

function RouteComponent() {
	const [exportClicked, setExportClicked] = useState(false);
	const [showLoading, setShowLoading] = useState(false);

	return (
		<div style={{ padding: "20px" }}>
			<h1>Analytics Dashboard Test</h1>

			<div style={{ marginBottom: "20px" }}>
				<button onClick={() => setShowLoading(!showLoading)}>
					Toggle Loading State
				</button>
			</div>

			<AnalyticsDashboard
				campaignId="test-campaign"
				analytics={mockAnalytics}
				loading={showLoading}
				dateRange={{
					start: new Date("2024-01-01"),
					end: new Date("2024-01-31"),
				}}
				onExport={() => setExportClicked(true)}
				data-testid="analytics-dashboard"
			/>

			{exportClicked && (
				<div data-testid="export-clicked">Export clicked!</div>
			)}
		</div>
	);
}
