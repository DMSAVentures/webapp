import type {
	ActiveFilter,
	UserFilters,
	WaitlistUserStatus,
} from "@/types/users.types";

const STATUS_LABELS: Record<WaitlistUserStatus, string> = {
	pending: "Pending",
	verified: "Verified",
	invited: "Invited",
	active: "Active",
	rejected: "Rejected",
};

function formatStatus(status: string): string {
	return STATUS_LABELS[status as WaitlistUserStatus] || status;
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

export function filtersToChips(
	filters: UserFilters,
	customFieldLabels?: Record<string, string>,
): ActiveFilter[] {
	const chips: ActiveFilter[] = [];

	// Status filters
	if (filters.status && filters.status.length > 0) {
		filters.status.forEach((s, i) => {
			chips.push({
				id: `status-${i}`,
				type: "status",
				label: "Status",
				value: formatStatus(s),
			});
		});
	}

	// Source filters
	if (filters.source && filters.source.length > 0) {
		filters.source.forEach((s, i) => {
			chips.push({
				id: `source-${i}`,
				type: "source",
				label: "Source",
				value: s.charAt(0).toUpperCase() + s.slice(1),
			});
		});
	}

	// Date range
	if (filters.dateRange) {
		chips.push({
			id: "dateRange",
			type: "dateRange",
			label: "Date",
			value: `${formatDate(filters.dateRange.start)} - ${formatDate(filters.dateRange.end)}`,
		});
	}

	// Position range
	if (filters.minPosition !== undefined || filters.maxPosition !== undefined) {
		const min = filters.minPosition ?? "any";
		const max = filters.maxPosition ?? "any";
		chips.push({
			id: "position",
			type: "position",
			label: "Position",
			value: `${min} - ${max}`,
		});
	}

	// Has referrals
	if (filters.hasReferrals) {
		chips.push({
			id: "hasReferrals",
			type: "hasReferrals",
			label: "Referrals",
			value: "Has referrals",
		});
	}

	// Custom fields
	if (filters.customFields) {
		Object.entries(filters.customFields).forEach(([fieldName, value]) => {
			const displayValue = Array.isArray(value) ? value.join(", ") : value;
			const displayLabel = customFieldLabels?.[fieldName] || fieldName;
			chips.push({
				id: `custom-${fieldName}`,
				type: "customField",
				label: displayLabel,
				value: displayValue,
				fieldName,
			});
		});
	}

	return chips;
}

export function removeFilterById(
	filters: UserFilters,
	filterId: string,
): UserFilters {
	const newFilters = { ...filters };

	if (filterId.startsWith("status-")) {
		const index = parseInt(filterId.split("-")[1], 10);
		newFilters.status = filters.status?.filter((_, i) => i !== index);
		if (newFilters.status?.length === 0) delete newFilters.status;
	} else if (filterId.startsWith("source-")) {
		const index = parseInt(filterId.split("-")[1], 10);
		newFilters.source = filters.source?.filter((_, i) => i !== index);
		if (newFilters.source?.length === 0) delete newFilters.source;
	} else if (filterId === "dateRange") {
		delete newFilters.dateRange;
	} else if (filterId === "position") {
		delete newFilters.minPosition;
		delete newFilters.maxPosition;
	} else if (filterId === "hasReferrals") {
		delete newFilters.hasReferrals;
	} else if (filterId.startsWith("custom-")) {
		const fieldName = filterId.replace("custom-", "");
		if (newFilters.customFields) {
			const { [fieldName]: _, ...rest } = newFilters.customFields;
			newFilters.customFields = Object.keys(rest).length > 0 ? rest : undefined;
		}
	}

	return newFilters;
}

export function hasActiveFilters(filters: UserFilters): boolean {
	return (
		(filters.status?.length ?? 0) > 0 ||
		(filters.source?.length ?? 0) > 0 ||
		filters.hasReferrals === true ||
		filters.minPosition !== undefined ||
		filters.maxPosition !== undefined ||
		filters.dateRange !== undefined ||
		(filters.customFields && Object.keys(filters.customFields).length > 0) ||
		false
	);
}
