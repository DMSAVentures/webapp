/**
 * FormCanvas Component
 * Drop zone for form fields with drag-drop reordering
 */

import { type HTMLAttributes, memo } from "react";
import type { FormField } from "@/types/common.types";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { DropZone } from "../DropZone/component";
import { FieldItem } from "../FieldItem/component";
import styles from "./component.module.scss";

export interface FormCanvasProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of form fields */
	fields: FormField[];
	/** Callback when fields change */
	onFieldsChange: (fields: FormField[]) => void;
	/** Callback when a field is selected */
	onFieldSelect: (fieldId: string) => void;
	/** Currently selected field ID */
	selectedFieldId?: string;
	/** Additional CSS class name */
	className?: string;
}

/**
 * FormCanvas displays and manages form fields with drag-drop
 */
export const FormCanvas = memo<FormCanvasProps>(function FormCanvas({
	fields,
	onFieldsChange,
	onFieldSelect,
	selectedFieldId,
	className: customClassName,
	...props
}) {
	const {
		dragState,
		handleFieldDragStart,
		handleDragEnd,
		handleDropZoneDragOver,
		handleDropZoneDragLeave,
		handleDropZoneDrop,
	} = useDragAndDrop();

	const classNames = [
		styles.root,
		dragState.isDragging && styles.dragging,
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	const handleFieldDelete = (fieldId: string) => {
		// Find the field to check if it's an email field
		const fieldToDelete = fields.find((f) => f.id === fieldId);

		// Prevent deletion of email field (required for all forms)
		if (fieldToDelete?.type === "email") {
			return;
		}

		// If deleting the currently selected field, deselect it
		if (selectedFieldId === fieldId) {
			onFieldSelect("");
		}

		const newFields = fields
			.filter((f) => f.id !== fieldId)
			.map((field, idx) => ({ ...field, order: idx }));
		onFieldsChange(newFields);
	};

	const handleDrop = (index: number) => (e: React.DragEvent) => {
		const newFields = handleDropZoneDrop(index, fields)(e);
		if (newFields) {
			onFieldsChange(newFields);
		}
	};

	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<h3 className={styles.title}>Form Builder</h3>
				<p className={styles.subtitle}>
					{fields.length === 0
						? "Drag fields here or click to add"
						: `${fields.length} field${fields.length !== 1 ? "s" : ""}`}
				</p>
			</div>

			<div className={styles.canvas}>
				{fields.length === 0 ? (
					<div
						className={styles.emptyState}
						onDragOver={handleDropZoneDragOver(0)}
						onDragLeave={handleDropZoneDragLeave}
						onDrop={handleDrop(0)}
					>
						<i className="ri-drag-drop-line" aria-hidden="true" />
						<p>Drag fields from the left panel to start building your form</p>
					</div>
				) : (
					<div className={styles.fieldsList}>
						{fields.map((field, index) => (
							<div key={field.id} className={styles.fieldContainer}>
								{/* Drop zone before each field */}
								<DropZone
									index={index}
									isActive={dragState.dropTargetIndex === index}
									onDragOver={handleDropZoneDragOver(index)}
									onDragLeave={handleDropZoneDragLeave}
									onDrop={handleDrop(index)}
								/>

								{/* Field item */}
								<FieldItem
									field={field}
									isSelected={selectedFieldId === field.id}
									onDragStart={handleFieldDragStart(field.id)}
									onDragEnd={handleDragEnd}
									onSelect={() => onFieldSelect(field.id)}
									onDelete={() => handleFieldDelete(field.id)}
								/>
							</div>
						))}

						{/* Drop zone after last field - fills remaining space */}
						<DropZone
							index={fields.length}
							isActive={dragState.dropTargetIndex === fields.length}
							onDragOver={handleDropZoneDragOver(fields.length)}
							onDragLeave={handleDropZoneDragLeave}
							onDrop={handleDrop(fields.length)}
							className={styles.finalDropZone}
						/>
					</div>
				)}
			</div>
		</div>
	);
});

FormCanvas.displayName = "FormCanvas";
