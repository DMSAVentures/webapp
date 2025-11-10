/**
 * CSV Export Utilities
 * Helper functions for exporting data to CSV format
 */

import type { WaitlistUser } from "@/types/common.types";
import { formatPositionForCSV } from "./positionFormatter";

/**
 * Escapes CSV field values to handle special characters
 */
function escapeCSVField(field: unknown): string {
	if (field === null || field === undefined) {
		return "";
	}

	const value = String(field);

	// If the value contains comma, quotes, or newlines, wrap it in quotes and escape existing quotes
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}

	return value;
}

/**
 * Converts an array of WaitlistUser objects to CSV format
 */
export function convertUsersToCSV(users: WaitlistUser[]): string {
	if (users.length === 0) {
		return "";
	}

	// Define CSV headers
	const headers = [
		"ID",
		"Email",
		"Name",
		"Status",
		"Position",
		"Referral Code",
		"Referred By",
		"Referral Count",
		"Points",
		"Source",
		"UTM Source",
		"UTM Medium",
		"UTM Campaign",
		"UTM Content",
		"UTM Term",
		"Country",
		"Device",
		"IP Address",
		"User Agent",
		"Created At",
		"Verified At",
		"Invited At",
	];

	// Build CSV rows
	const rows = users.map((user) => {
		return [
			user.id,
			user.email,
			user.name || "",
			user.status,
			formatPositionForCSV(user.position),
			user.referralCode,
			user.referredBy || "",
			user.referralCount,
			user.points,
			user.source,
			user.utmParams?.source || "",
			user.utmParams?.medium || "",
			user.utmParams?.campaign || "",
			user.utmParams?.content || "",
			user.utmParams?.term || "",
			user.metadata?.country || "",
			user.metadata?.device || "",
			user.metadata?.ipAddress || "",
			user.metadata?.userAgent || "",
			user.createdAt.toISOString(),
			user.verifiedAt?.toISOString() || "",
			user.invitedAt?.toISOString() || "",
		]
			.map(escapeCSVField)
			.join(",");
	});

	// Combine headers and rows
	return [headers.join(","), ...rows].join("\n");
}

/**
 * Downloads CSV data as a file
 */
export function downloadCSV(csvContent: string, filename: string): void {
	// Create a Blob from the CSV content
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

	// Create a temporary download link
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", filename);
	link.style.visibility = "hidden";

	// Trigger download
	document.body.appendChild(link);
	link.click();

	// Cleanup
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Exports WaitlistUser data to CSV and triggers download
 */
export function exportUsersToCSV(
	users: WaitlistUser[],
	campaignName?: string,
): void {
	// Generate CSV content
	const csvContent = convertUsersToCSV(users);

	if (!csvContent) {
		console.warn("No data to export");
		return;
	}

	// Generate filename with timestamp
	const timestamp = new Date().toISOString().split("T")[0];
	const campaignPrefix = campaignName
		? `${campaignName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_`
		: "";
	const filename = `${campaignPrefix}users_${timestamp}.csv`;

	// Download the file
	downloadCSV(csvContent, filename);
}
