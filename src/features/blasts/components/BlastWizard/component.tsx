/**
 * BlastWizard Component
 *
 * Multi-step wizard for creating email blasts
 */

import { useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, memo, useCallback, useState } from "react";
import {
	useCreateBlast,
	useScheduleBlast,
	useSendBlast,
} from "@/hooks/useBlasts";
import { useGetEmailTemplates } from "@/hooks/useEmailTemplates";
import { useGetSegments } from "@/hooks/useSegments";
import { Button } from "@/proto-design-system/Button/button";
import Dropdown, {
	type DropdownOptionInput,
} from "@/proto-design-system/dropdown/dropdown";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import styles from "./component.module.scss";

export interface BlastWizardProps {
	/** Campaign ID */
	campaignId: string;
	/** Pre-selected segment ID */
	segmentId?: string;
}

type Step = "details" | "schedule" | "review";

export const BlastWizard = memo(function BlastWizard({
	campaignId,
	segmentId: initialSegmentId,
}: BlastWizardProps) {
	const navigate = useNavigate();

	// Form state
	const [step, setStep] = useState<Step>("details");
	const [name, setName] = useState("");
	const [subject, setSubject] = useState("");
	const [selectedSegmentId, setSelectedSegmentId] = useState(
		initialSegmentId || "",
	);
	const [selectedTemplateId, setSelectedTemplateId] = useState("");
	const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");

	// Data hooks
	const { segments, loading: loadingSegments } = useGetSegments(campaignId);
	const { templates, loading: loadingTemplates } = useGetEmailTemplates(
		campaignId,
		"custom",
	);

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

	const selectedSegment = segments.find((s) => s.id === selectedSegmentId);
	const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

	const handleCancel = useCallback(() => {
		navigate({
			to: "/campaigns/$campaignId/blasts",
			params: { campaignId },
		});
	}, [navigate, campaignId]);

	const handleNextStep = useCallback(() => {
		if (step === "details") {
			setStep("schedule");
		} else if (step === "schedule") {
			setStep("review");
		}
	}, [step]);

	const handlePrevStep = useCallback(() => {
		if (step === "schedule") {
			setStep("details");
		} else if (step === "review") {
			setStep("schedule");
		}
	}, [step]);

	const canProceedDetails =
		name.trim() && subject.trim() && selectedSegmentId && selectedTemplateId;
	const canProceedSchedule =
		scheduleType === "now" || (scheduledDate && scheduledTime);

	const handleSubmit = useCallback(async () => {
		// First create the blast
		const blast = await createBlast(campaignId, {
			name,
			segmentId: selectedSegmentId,
			templateId: selectedTemplateId,
			subject,
		});

		if (!blast) return;

		if (scheduleType === "now") {
			// Send immediately
			const result = await sendBlast(campaignId, blast.id);
			if (result) {
				navigate({
					to: "/campaigns/$campaignId/blasts/$blastId",
					params: { campaignId, blastId: blast.id },
				});
			}
		} else {
			// Schedule for later
			const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
			const result = await scheduleBlast(campaignId, blast.id, scheduledAt);
			if (result) {
				navigate({
					to: "/campaigns/$campaignId/blasts/$blastId",
					params: { campaignId, blastId: blast.id },
				});
			}
		}
	}, [
		campaignId,
		name,
		subject,
		selectedSegmentId,
		selectedTemplateId,
		scheduleType,
		scheduledDate,
		scheduledTime,
		createBlast,
		sendBlast,
		scheduleBlast,
		navigate,
	]);

	const segmentOptions: DropdownOptionInput[] = segments.map((s) => ({
		value: s.id,
		label: `${s.name} (${(s.cachedUserCount ?? 0).toLocaleString()} users)`,
		selected: s.id === selectedSegmentId,
	}));

	const templateOptions: DropdownOptionInput[] = templates.map((t) => ({
		value: t.id,
		label: t.name,
		selected: t.id === selectedTemplateId,
	}));

	const handleSegmentChange = useCallback((option: DropdownOptionInput) => {
		setSelectedSegmentId(option.value);
	}, []);

	const handleTemplateChange = useCallback((option: DropdownOptionInput) => {
		setSelectedTemplateId(option.value);
	}, []);

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
					className={`${styles.step} ${step === "schedule" ? styles.active : ""}`}
				>
					<span className={styles.stepNumber}>2</span>
					<span className={styles.stepLabel}>Schedule</span>
				</div>
				<div className={styles.stepConnector} />
				<div
					className={`${styles.step} ${step === "review" ? styles.active : ""}`}
				>
					<span className={styles.stepNumber}>3</span>
					<span className={styles.stepLabel}>Review</span>
				</div>
			</div>

			<div className={styles.content}>
				{step === "details" && (
					<div className={styles.stepContent}>
						<h3 className={styles.sectionTitle}>Blast Details</h3>
						<div className={styles.fields}>
							<TextInput
								label="Blast Name"
								value={name}
								onChange={handleNameChange}
								placeholder="e.g., December Newsletter"
								required
							/>
							<TextInput
								label="Email Subject"
								value={subject}
								onChange={handleSubjectChange}
								placeholder="e.g., Your December update is here!"
								required
							/>
							<Dropdown
								label="Target Segment"
								options={segmentOptions}
								onChange={handleSegmentChange}
								placeholderText={
									loadingSegments ? "Loading..." : "Select a segment"
								}
								disabled={loadingSegments}
								size="medium"
							/>
							<Dropdown
								label="Email Template"
								options={templateOptions}
								onChange={handleTemplateChange}
								placeholderText={
									loadingTemplates ? "Loading..." : "Select a template"
								}
								disabled={loadingTemplates}
								size="medium"
							/>
						</div>
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
								<TextInput
									label="Date"
									type="date"
									value={scheduledDate}
									onChange={handleScheduledDateChange}
									required
								/>
								<TextInput
									label="Time"
									type="time"
									value={scheduledTime}
									onChange={handleScheduledTimeChange}
									required
								/>
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
								<span className={styles.reviewLabel}>Segment</span>
								<span className={styles.reviewValue}>
									{selectedSegment?.name} (
									{(selectedSegment?.cachedUserCount ?? 0).toLocaleString()}{" "}
									users)
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
							disabled={
								step === "details" ? !canProceedDetails : !canProceedSchedule
							}
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
