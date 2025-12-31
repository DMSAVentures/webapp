/**
 * SegmentBuilder Component
 *
 * Form for creating and editing segments with filter criteria
 */

import {
	type ChangeEvent,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import {
	useCreateSegment,
	usePreviewSegment,
	useUpdateSegment,
} from "@/hooks/useSegments";
import { Checkbox } from "@/proto-design-system/components/forms/Checkbox";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Button } from "@/proto-design-system/components/primitives/Button";
import type { Segment, SegmentFilterCriteria } from "@/types/segment";
import styles from "./component.module.scss";

export interface SegmentBuilderProps {
	/** Campaign ID */
	campaignId: string;
	/** Segment to edit (null for new) */
	segment: Segment | null;
	/** Callback when closing the builder */
	onClose: () => void;
	/** Callback when segment is saved */
	onSave: (segment: Segment) => void;
}

const STATUSES = [
	{ value: "pending", label: "Pending" },
	{ value: "approved", label: "Approved" },
	{ value: "waitlisted", label: "Waitlisted" },
	{ value: "rejected", label: "Rejected" },
];

const SOURCES = [
	{ value: "direct", label: "Direct" },
	{ value: "referral", label: "Referral" },
	{ value: "embed", label: "Embed" },
	{ value: "api", label: "API" },
];

export const SegmentBuilder = memo(function SegmentBuilder({
	campaignId,
	segment,
	onClose,
	onSave,
}: SegmentBuilderProps) {
	const [name, setName] = useState(segment?.name || "");
	const [description, setDescription] = useState(segment?.description || "");
	const [filters, setFilters] = useState<SegmentFilterCriteria>(
		segment?.filterCriteria || {},
	);

	const {
		createSegment,
		loading: creating,
		error: createError,
	} = useCreateSegment();
	const {
		updateSegment,
		loading: updating,
		error: updateError,
	} = useUpdateSegment();
	const { previewSegment, loading: previewing, preview } = usePreviewSegment();

	const isEditing = !!segment;
	const loading = creating || updating;
	const error = createError || updateError;

	// Preview on filter change
	useEffect(() => {
		const timer = setTimeout(() => {
			previewSegment(campaignId, filters);
		}, 500);
		return () => clearTimeout(timer);
	}, [campaignId, filters, previewSegment]);

	const handleStatusChange = useCallback((status: string, checked: boolean) => {
		setFilters((prev) => {
			const statuses = prev.statuses || [];
			if (checked) {
				return { ...prev, statuses: [...statuses, status] };
			}
			return { ...prev, statuses: statuses.filter((s) => s !== status) };
		});
	}, []);

	const handleSourceChange = useCallback((source: string, checked: boolean) => {
		setFilters((prev) => {
			const sources = prev.sources || [];
			if (checked) {
				return { ...prev, sources: [...sources, source] };
			}
			return { ...prev, sources: sources.filter((s) => s !== source) };
		});
	}, []);

	const handleEmailVerifiedChange = useCallback((checked: boolean) => {
		setFilters((prev) => ({
			...prev,
			emailVerified: checked ? true : undefined,
		}));
	}, []);

	const handleMinReferralsChange = useCallback((value: string) => {
		const num = parseInt(value, 10);
		setFilters((prev) => ({
			...prev,
			minReferrals: isNaN(num) ? undefined : num,
		}));
	}, []);

	const handleSave = useCallback(async () => {
		if (!name.trim()) return;

		let result: Segment | null;
		if (isEditing) {
			result = await updateSegment(campaignId, segment.id, {
				name,
				description: description || undefined,
				filterCriteria: filters,
			});
		} else {
			result = await createSegment(
				campaignId,
				name,
				filters,
				description || undefined,
			);
		}

		if (result) {
			onSave(result);
		}
	}, [
		name,
		description,
		filters,
		isEditing,
		segment,
		campaignId,
		createSegment,
		updateSegment,
		onSave,
	]);

	const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	}, []);

	const handleDescriptionChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setDescription(e.target.value);
		},
		[],
	);

	const handleMinReferralsInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			handleMinReferralsChange(e.target.value);
		},
		[handleMinReferralsChange],
	);

	return (
		<div className={styles.root}>
			<h2 className={styles.title}>
				{isEditing ? "Edit Segment" : "Create Segment"}
			</h2>

			<div className={styles.content}>
				<div className={styles.form}>
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Basic Information</h3>
						<div className={styles.fields}>
							<label>Segment Name</label>
							<Input
								value={name}
								onChange={handleNameChange}
								placeholder="e.g., Verified Users, High Referrers"
								required
							/>
							<label>Description</label>
							<Input
								value={description}
								onChange={handleDescriptionChange}
								placeholder="Optional description"
							/>
						</div>
					</div>

					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Filter Criteria</h3>

						<div className={styles.filterGroup}>
							<h4 className={styles.filterLabel}>Status</h4>
							<div className={styles.checkboxGroup}>
								{STATUSES.map(({ value, label }) => (
									<label key={value} className={styles.checkboxLabel}>
										<Checkbox
											checked={!!filters.statuses?.includes(value)}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												handleStatusChange(value, e.target.checked)
											}
										/>
										<span>{label}</span>
									</label>
								))}
							</div>
						</div>

						<div className={styles.filterGroup}>
							<h4 className={styles.filterLabel}>Source</h4>
							<div className={styles.checkboxGroup}>
								{SOURCES.map(({ value, label }) => (
									<label key={value} className={styles.checkboxLabel}>
										<Checkbox
											checked={!!filters.sources?.includes(value)}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												handleSourceChange(value, e.target.checked)
											}
										/>
										<span>{label}</span>
									</label>
								))}
							</div>
						</div>

						<div className={styles.filterGroup}>
							<h4 className={styles.filterLabel}>Email Verification</h4>
							<label className={styles.checkboxLabel}>
								<Checkbox
									checked={!!filters.emailVerified}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										handleEmailVerifiedChange(e.target.checked)
									}
								/>
								<span>Only verified emails</span>
							</label>
						</div>

						<div className={styles.filterGroup}>
							<h4 className={styles.filterLabel}>Referrals</h4>
							<label>Minimum referrals</label>
							<Input
								type="number"
								value={filters.minReferrals?.toString() || ""}
								onChange={handleMinReferralsInputChange}
								placeholder="0"
							/>
						</div>
					</div>
				</div>

				<div className={styles.preview}>
					<div className={styles.previewCard}>
						<h3 className={styles.sectionTitle}>Preview</h3>
						<div className={styles.previewContent}>
							{previewing ? (
								<p className={styles.previewLoading}>Calculating...</p>
							) : preview ? (
								<>
									<div className={styles.previewCount}>
										<span className={styles.previewNumber}>
											{(preview.count ?? 0).toLocaleString()}
										</span>
										<span className={styles.previewLabel}>
											users match this segment
										</span>
									</div>
									{preview.sampleUsers.length > 0 && (
										<div className={styles.sampleUsers}>
											<h4>Sample users:</h4>
											<ul>
												{preview.sampleUsers.slice(0, 5).map((user) => (
													<li key={user.id}>{user.email}</li>
												))}
											</ul>
										</div>
									)}
								</>
							) : (
								<p className={styles.previewEmpty}>
									Add filters to see matching users
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{error && <div className={styles.error}>Error: {error.error}</div>}

			<div className={styles.actions}>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={handleSave}
					disabled={loading || !name.trim()}
				>
					{loading
						? "Saving..."
						: isEditing
							? "Update Segment"
							: "Create Segment"}
				</Button>
			</div>
		</div>
	);
});

SegmentBuilder.displayName = "SegmentBuilder";
