/**
 * BlastWizard Component
 *
 * Multi-step wizard for creating email blasts with multi-segment targeting
 */

import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { type ChangeEvent, memo, useCallback, useState } from "react";
import { useGetBlastEmailTemplates } from "@/hooks/useBlastEmailTemplates";
import {
	useCreateBlast,
	useScheduleBlast,
	useSendBlast,
} from "@/hooks/useBlasts";
import { Input } from "@/proto-design-system/components/forms/Input";
import type { SelectOption } from "@/proto-design-system/components/forms/Select";
import { Select } from "@/proto-design-system/components/forms/Select";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { SegmentMultiSelect } from "../SegmentMultiSelect/component";
import styles from "./component.module.scss";

export interface BlastWizardProps {
	/** Pre-selected segment ID */
	segmentId?: string;
}

type Step = "details" | "segments" | "schedule" | "review";

export const BlastWizard = memo(function BlastWizard({
	segmentId: initialSegmentId,
}: BlastWizardProps) {
	const navigate = useNavigate();

	// Form state
	const [step, setStep] = useState<Step>("details");
	const [name, setName] = useState("");
	const [subject, setSubject] = useState("");
	const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>(
		initialSegmentId ? [initialSegmentId] : [],
	);
	const [selectedTemplateId, setSelectedTemplateId] = useState("");
	const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");

	// Data hooks - blast templates are account-level
	const { templates, loading: loadingTemplates } = useGetBlastEmailTemplates();

	// Action hooks
	const {
		createBlast,
		loading: creating,
		error: createError,
	} = useCreateBlast();
	const { sendBlast, loading: sending, error: sendError } = useSendBlast();
	const {
		scheduleBlast,
		loading: scheduling,
		error: scheduleError,
	} = useScheduleBlast();

	const loading = creating || sending || scheduling;
	const error = createError || sendError || scheduleError;

	const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

	const handleCancel = useCallback(() => {
		navigate({
			to: "/blasts",
		});
	}, [navigate]);

	const handleNextStep = useCallback(() => {
		if (step === "details") {
			setStep("segments");
		} else if (step === "segments") {
			setStep("schedule");
		} else if (step === "schedule") {
			setStep("review");
		}
	}, [step]);

	const handlePrevStep = useCallback(() => {
		if (step === "segments") {
			setStep("details");
		} else if (step === "schedule") {
			setStep("segments");
		} else if (step === "review") {
			setStep("schedule");
		}
	}, [step]);

	const canProceedDetails = name.trim() && subject.trim() && selectedTemplateId;
	const canProceedSegments = selectedSegmentIds.length > 0;
	const canProceedSchedule =
		scheduleType === "now" || (scheduledDate && scheduledTime);

	const handleSubmit = useCallback(async () => {
		// Create the blast with multi-segment support
		const blast = await createBlast({
			name,
			segmentIds: selectedSegmentIds,
			blastTemplateId: selectedTemplateId,
			subject,
		});

		if (!blast) return;

		if (scheduleType === "now") {
			// Send immediately
			const result = await sendBlast(blast.id);
			if (result) {
				navigate({
					to: "/blasts/$blastId",
					params: { blastId: blast.id },
				});
			}
		} else {
			// Schedule for later
			const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
			const result = await scheduleBlast(blast.id, scheduledAt);
			if (result) {
				navigate({
					to: "/blasts/$blastId",
					params: { blastId: blast.id },
				});
			}
		}
	}, [
		name,
		subject,
		selectedSegmentIds,
		selectedTemplateId,
		scheduleType,
		scheduledDate,
		scheduledTime,
		createBlast,
		sendBlast,
		scheduleBlast,
		navigate,
	]);

	const templateOptions: SelectOption[] = templates.map((t) => ({
		value: t.id,
		label: t.name,
	}));

	const handleSegmentChange = useCallback((segmentIds: string[]) => {
		setSelectedSegmentIds(segmentIds);
	}, []);

	const handleTemplateChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setSelectedTemplateId(e.target.value);
		},
		[],
	);

	const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	}, []);

	const handleSubjectChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSubject(e.target.value);
		},
		[],
	);

	const handleScheduledDateChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setScheduledDate(e.target.value);
		},
		[],
	);

	const handleScheduledTimeChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setScheduledTime(e.target.value);
		},
		[],
	);

	const getStepDisabled = () => {
		if (step === "details") return !canProceedDetails;
		if (step === "segments") return !canProceedSegments;
		if (step === "schedule") return !canProceedSchedule;
		return false;
	};

	return (
		<div className={styles.root}>
			<h2 className={styles.title}>Create Email Blast</h2>

			<div className={styles.steps}>
				<div
					className={`${styles.step} ${step === "details" ? styles.active : ""}`}
				>
					<span className={styles.stepNumber}>1</span>
					<span className={styles.stepLabel}>Details</span>
				</div>
				<div className={styles.stepConnector} />
				<div
					className={`${styles.step} ${step === "segments" ? styles.active : ""}`}
				>
					<span className={styles.stepNumber}>2</span>
					<span className={styles.stepLabel}>Segments</span>
				</div>
				<div className={styles.stepConnector} />
				<div
					className={`${styles.step} ${step === "schedule" ? styles.active : ""}`}
				>
					<span className={styles.stepNumber}>3</span>
					<span className={styles.stepLabel}>Schedule</span>
				</div>
				<div className={styles.stepConnector} />
				<div
					className={`${styles.step} ${step === "review" ? styles.active : ""}`}
				>
					<span className={styles.stepNumber}>4</span>
					<span className={styles.stepLabel}>Review</span>
				</div>
			</div>

			<div className={styles.content}>
				{step === "details" && (
					<div className={styles.stepContent}>
						<h3 className={styles.sectionTitle}>Blast Details</h3>
						<div className={styles.fields}>
							<div>
								<label htmlFor="blast-name">Blast Name</label>
								<Input
									id="blast-name"
									value={name}
									onChange={handleNameChange}
									placeholder="e.g., December Newsletter"
									required
								/>
							</div>
							<div>
								<label htmlFor="email-subject">Email Subject</label>
								<Input
									id="email-subject"
									value={subject}
									onChange={handleSubjectChange}
									placeholder="e.g., Your December update is here!"
									required
								/>
							</div>
							<Select
								label="Email Template"
								options={templateOptions}
								onChange={handleTemplateChange}
								placeholder={
									loadingTemplates ? "Loading..." : "Select a template"
								}
								value={selectedTemplateId}
								disabled={loadingTemplates}
								size="md"
							/>
						</div>
					</div>
				)}

				{step === "segments" && (
					<div className={styles.stepContent}>
						<h3 className={styles.sectionTitle}>Select Target Segments</h3>
						<p className={styles.sectionDescription}>
							Choose one or more segments to target. Recipients will be
							deduplicated if they appear in multiple segments.
						</p>
						<SegmentMultiSelect
							selectedIds={selectedSegmentIds}
							onChange={handleSegmentChange}
						/>
					</div>
				)}

				{step === "schedule" && (
					<div className={styles.stepContent}>
						<h3 className={styles.sectionTitle}>Schedule</h3>
						<div className={styles.scheduleOptions}>
							<label className={styles.radioOption}>
								<input
									type="radio"
									name="scheduleType"
									value="now"
									checked={scheduleType === "now"}
									onChange={() => setScheduleType("now")}
								/>
								<div className={styles.radioContent}>
									<span className={styles.radioLabel}>Send immediately</span>
									<span className={styles.radioDescription}>
										Start sending as soon as you confirm
									</span>
								</div>
							</label>
							<label className={styles.radioOption}>
								<input
									type="radio"
									name="scheduleType"
									value="later"
									checked={scheduleType === "later"}
									onChange={() => setScheduleType("later")}
								/>
								<div className={styles.radioContent}>
									<span className={styles.radioLabel}>Schedule for later</span>
									<span className={styles.radioDescription}>
										Choose a specific date and time
									</span>
								</div>
							</label>
						</div>
						{scheduleType === "later" && (
							<div className={styles.scheduleFields}>
								<div>
									<label htmlFor="scheduled-date">Date</label>
									<Input
										id="scheduled-date"
										type="date"
										value={scheduledDate}
										onChange={handleScheduledDateChange}
										required
									/>
								</div>
								<div>
									<label htmlFor="scheduled-time">Time</label>
									<Input
										id="scheduled-time"
										type="time"
										value={scheduledTime}
										onChange={handleScheduledTimeChange}
										required
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{step === "review" && (
					<div className={styles.stepContent}>
						<h3 className={styles.sectionTitle}>Review & Confirm</h3>
						<div className={styles.reviewDetails}>
							<div className={styles.reviewItem}>
								<span className={styles.reviewLabel}>Name</span>
								<span className={styles.reviewValue}>{name}</span>
							</div>
							<div className={styles.reviewItem}>
								<span className={styles.reviewLabel}>Subject</span>
								<span className={styles.reviewValue}>{subject}</span>
							</div>
							<div className={styles.reviewItem}>
								<span className={styles.reviewLabel}>Segments</span>
								<span className={styles.reviewValue}>
									{selectedSegmentIds.length} segment
									{selectedSegmentIds.length !== 1 ? "s" : ""} selected
								</span>
							</div>
							<div className={styles.reviewItem}>
								<span className={styles.reviewLabel}>Template</span>
								<span className={styles.reviewValue}>
									{selectedTemplate?.name}
								</span>
							</div>
							<div className={styles.reviewItem}>
								<span className={styles.reviewLabel}>Schedule</span>
								<span className={styles.reviewValue}>
									{scheduleType === "now"
										? "Send immediately"
										: `Scheduled for ${scheduledDate} at ${scheduledTime}`}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{error && <div className={styles.error}>Error: {error.error}</div>}

			<div className={styles.actions}>
				{step !== "details" && (
					<Button variant="secondary" onClick={handlePrevStep}>
						Back
					</Button>
				)}
				<div className={styles.actionsRight}>
					<Button variant="secondary" onClick={handleCancel}>
						Cancel
					</Button>
					{step !== "review" ? (
						<Button
							variant="primary"
							onClick={handleNextStep}
							disabled={getStepDisabled()}
						>
							Continue
						</Button>
					) : (
						<Button variant="primary" onClick={handleSubmit} disabled={loading}>
							{loading
								? "Creating..."
								: scheduleType === "now"
									? "Send Now"
									: "Schedule Blast"}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
});

BlastWizard.displayName = "BlastWizard";
