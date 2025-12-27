/**
 * Email Blast UI Types
 *
 * UI types (camelCase) for email blasts
 */

export interface EmailBlast {
	id: string;
	campaignId: string;
	segmentId: string;
	templateId: string;
	name: string;
	subject: string;
	scheduledAt?: Date;
	startedAt?: Date;
	completedAt?: Date;
	status: EmailBlastStatus;
	totalRecipients: number;
	sentCount: number;
	deliveredCount: number;
	openedCount: number;
	clickedCount: number;
	bouncedCount: number;
	failedCount: number;
	batchSize: number;
	currentBatch: number;
	lastBatchAt?: Date;
	errorMessage?: string;
	sendThrottlePerSecond?: number;
	createdBy?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type EmailBlastStatus =
	| "draft"
	| "scheduled"
	| "processing"
	| "sending"
	| "completed"
	| "paused"
	| "cancelled"
	| "failed";

export interface BlastRecipient {
	id: string;
	blastId: string;
	userId: string;
	email: string;
	status: BlastRecipientStatus;
	emailLogId?: string;
	queuedAt?: Date;
	sentAt?: Date;
	deliveredAt?: Date;
	openedAt?: Date;
	clickedAt?: Date;
	bouncedAt?: Date;
	failedAt?: Date;
	errorMessage?: string;
	batchNumber?: number;
	createdAt: Date;
	updatedAt: Date;
}

export type BlastRecipientStatus =
	| "pending"
	| "queued"
	| "sending"
	| "sent"
	| "delivered"
	| "opened"
	| "clicked"
	| "bounced"
	| "failed";

export interface BlastAnalytics {
	blastId: string;
	name: string;
	status: EmailBlastStatus;
	totalRecipients: number;
	sent: number;
	delivered: number;
	opened: number;
	clicked: number;
	bounced: number;
	failed: number;
	openRate: number;
	clickRate: number;
	bounceRate: number;
	startedAt?: Date;
	completedAt?: Date;
	durationSeconds?: number;
}

export interface CreateEmailBlastInput {
	name: string;
	segmentId: string;
	templateId: string;
	subject: string;
	scheduledAt?: Date;
	batchSize?: number;
	sendThrottlePerSecond?: number;
}

export interface UpdateEmailBlastInput {
	name?: string;
	subject?: string;
	batchSize?: number;
}
