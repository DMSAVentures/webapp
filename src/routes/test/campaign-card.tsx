import { createFileRoute } from "@tanstack/react-router";
import { CampaignCard } from "@/features/campaigns/components/CampaignCard/component";
import type { Campaign } from "@/types/common.types";
import { useState } from "react";

export const Route = createFileRoute("/test/campaign-card")({
	component: RouteComponent,
});

const mockCampaign: Campaign = {
	id: "test-campaign-1",
	name: "Summer Sale Campaign",
	description: "A special promotional campaign for summer products",
	status: "active",
	createdAt: new Date("2024-01-15"),
	stats: {
		totalSignups: 1234,
		totalReferrals: 567,
		viralCoefficient: 2.3,
	},
};

const mockCampaignDraft: Campaign = {
	id: "test-campaign-2",
	name: "Draft Campaign",
	description: "This is a draft campaign",
	status: "draft",
	createdAt: new Date("2024-02-01"),
};

function RouteComponent() {
	const [editClicked, setEditClicked] = useState(false);
	const [deleteClicked, setDeleteClicked] = useState(false);
	const [duplicateClicked, setDuplicateClicked] = useState(false);

	return (
		<div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
			<h1>Campaign Card Tests</h1>

			<div style={{ marginBottom: "20px" }}>
				<h2>Campaign with Stats and Actions</h2>
				<CampaignCard
					campaign={mockCampaign}
					showStats={true}
					actions={{
						onEdit: () => setEditClicked(true),
						onDelete: () => setDeleteClicked(true),
						onDuplicate: () => setDuplicateClicked(true),
					}}
					data-testid="campaign-card-with-stats"
				/>
				{editClicked && <div data-testid="edit-clicked">Edit clicked!</div>}
				{deleteClicked && <div data-testid="delete-clicked">Delete clicked!</div>}
				{duplicateClicked && (
					<div data-testid="duplicate-clicked">Duplicate clicked!</div>
				)}
			</div>

			<div style={{ marginBottom: "20px" }}>
				<h2>Draft Campaign without Stats</h2>
				<CampaignCard
					campaign={mockCampaignDraft}
					showStats={false}
					data-testid="campaign-card-draft"
				/>
			</div>
		</div>
	);
}
