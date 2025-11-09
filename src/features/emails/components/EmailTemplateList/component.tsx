/**
 * EmailTemplateList Component
 * Displays list of email templates with action buttons
 */

import { type HTMLAttributes, memo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import type { EmailTemplate } from "@/types/common.types";
import styles from "./component.module.scss";

export interface EmailTemplateListProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Campaign ID to fetch templates for */
	campaignId: string;
	/** Callback when a template is selected */
	onSelect?: (templateId: string) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Maps template type to display label
 */
const getTypeLabel = (type: EmailTemplate["type"]): string => {
	const labels: Record<EmailTemplate["type"], string> = {
		welcome: "Welcome",
		verification: "Verification",
		position_update: "Position Update",
		milestone: "Milestone",
		invitation: "Invitation",
		launch: "Launch",
		custom: "Custom",
	};
	return labels[type];
};

/**
 * EmailTemplateCard - Individual template card
 */
interface TemplateCardProps {
	template: EmailTemplate;
	onPreview: () => void;
	onEdit: () => void;
	onDuplicate: () => void;
	onDelete: () => void;
	onSelect?: () => void;
}

const EmailTemplateCard = memo<TemplateCardProps>(function EmailTemplateCard({
	template,
	onPreview,
	onEdit,
	onDuplicate,
	onDelete,
	onSelect,
}) {
	return (
		<div className={styles.card} onClick={onSelect}>
			<div className={styles.cardHeader}>
				<div className={styles.cardTitle}>
					<h3 className={styles.templateName}>{template.name}</h3>
					<StatusBadge
						text={template.status === "active" ? "Active" : "Draft"}
						variant={template.status === "active" ? "completed" : "pending"}
						styleType="stroke"
					/>
				</div>
				<span className={styles.templateType}>
					<i className="ri-mail-line" aria-hidden="true" />
					{getTypeLabel(template.type)}
				</span>
			</div>

			<div className={styles.cardContent}>
				<div className={styles.subject}>
					<span className={styles.subjectLabel}>Subject:</span>
					<span className={styles.subjectText}>{template.subject}</span>
				</div>
				{template.preheader && (
					<div className={styles.preheader}>
						<span className={styles.preheaderLabel}>Preheader:</span>
						<span className={styles.preheaderText}>{template.preheader}</span>
					</div>
				)}
			</div>

			<div className={styles.cardFooter}>
				<span className={styles.date}>
					<i className="ri-calendar-line" aria-hidden="true" />
					Updated{" "}
					{new Date(template.updatedAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</span>
				<div className={styles.actions}>
					<IconOnlyButton
						iconClass="eye-line"
						variant="secondary"
						ariaLabel="Preview template"
						onClick={(e) => {
							e.stopPropagation();
							onPreview();
						}}
					/>
					<IconOnlyButton
						iconClass="edit-line"
						variant="secondary"
						ariaLabel="Edit template"
						onClick={(e) => {
							e.stopPropagation();
							onEdit();
						}}
					/>
					<IconOnlyButton
						iconClass="file-copy-line"
						variant="secondary"
						ariaLabel="Duplicate template"
						onClick={(e) => {
							e.stopPropagation();
							onDuplicate();
						}}
					/>
					<IconOnlyButton
						iconClass="delete-bin-line"
						variant="secondary"
						ariaLabel="Delete template"
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
					/>
				</div>
			</div>
		</div>
	);
});

EmailTemplateCard.displayName = "EmailTemplateCard";

/**
 * EmailTemplateList - Main component
 */
export const EmailTemplateList = memo<EmailTemplateListProps>(
	function EmailTemplateList({
		campaignId,
		onSelect,
		className: customClassName,
		...props
	}) {
		// TODO: Fetch templates from API using campaignId
		// For now, using mock data structure
		const [templates] = useState<EmailTemplate[]>([]);

		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		const handlePreview = (templateId: string) => {
			// TODO: Open preview modal
			console.log("Preview template:", templateId);
		};

		const handleEdit = (templateId: string) => {
			// TODO: Navigate to edit page
			console.log("Edit template:", templateId);
		};

		const handleDuplicate = (templateId: string) => {
			// TODO: Duplicate template
			console.log("Duplicate template:", templateId);
		};

		const handleDelete = (templateId: string) => {
			// TODO: Show confirmation dialog and delete
			console.log("Delete template:", templateId);
		};

		const handleSelect = (templateId: string) => {
			onSelect?.(templateId);
		};

		const handleCreateNew = () => {
			// TODO: Navigate to create template page
			console.log("Create new template");
		};

		return (
			<div className={classNames} {...props}>
				<div className={styles.header}>
					<div className={styles.headerContent}>
						<h2 className={styles.title}>Email Templates</h2>
						<p className={styles.subtitle}>
							Create and manage email templates for your campaign
						</p>
					</div>
					<Button
						variant="primary"
						size="medium"
						leftIcon="add-line"
						onClick={handleCreateNew}
					>
						Create Template
					</Button>
				</div>

				{templates.length === 0 ? (
					<div className={styles.emptyState}>
						<i
							className={`ri-mail-line ${styles.emptyIcon}`}
							aria-hidden="true"
						/>
						<h3 className={styles.emptyTitle}>No templates yet</h3>
						<p className={styles.emptyDescription}>
							Create your first email template to start engaging with your
							audience
						</p>
						<Button
							variant="primary"
							size="medium"
							leftIcon="add-line"
							onClick={handleCreateNew}
						>
							Create Template
						</Button>
					</div>
				) : (
					<div className={styles.grid}>
						{templates.map((template) => (
							<EmailTemplateCard
								key={template.id}
								template={template}
								onPreview={() => handlePreview(template.id)}
								onEdit={() => handleEdit(template.id)}
								onDuplicate={() => handleDuplicate(template.id)}
								onDelete={() => handleDelete(template.id)}
								onSelect={() => handleSelect(template.id)}
							/>
						))}
					</div>
				)}
			</div>
		);
	},
);

EmailTemplateList.displayName = "EmailTemplateList";
