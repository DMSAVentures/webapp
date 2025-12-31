/**
 * FormCanvas Component
 * Drop zone for form fields with drag-drop reordering
 */

import { GripVertical } from "lucide-react";
import { type HTMLAttributes, memo, useCallback } from "react";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { FormDesign, FormField } from "@/types/common.types";
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
	/** Current layout mode */
	layout?: FormDesign["layout"];
	/** Additional CSS class name */
	className?: string;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Check if a field can be deleted (last email field cannot be deleted) */
function canDeleteField(field: FormField, allFields: FormField[]): boolean {
	if (field.type !== "email") {
		return true;
	}
	// Allow deletion if there are other email fields
	const emailFieldCount = allFields.filter((f) => f.type === "email").length;
	return emailFieldCount > 1;
}

/** Delete a field and reorder remaining fields */
function deleteFieldFromList(
	fields: FormField[],
	fieldId: string,
): FormField[] {
	return fields
		.filter((f) => f.id !== fieldId)
		.map((field, idx) => ({ ...field, order: idx }));
}

/** Toggle field column between 1 and 2 */
function toggleFieldColumn(fields: FormField[], fieldId: string): FormField[] {
	return fields.map((field) => {
		if (field.id === fieldId) {
			const currentColumn = field.column || 1;
			return { ...field, column: currentColumn === 1 ? 2 : 1 } as FormField;
		}
		return field;
	});
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing field deletion */
function useFieldDeletion(
	fields: FormField[],
	selectedFieldId: string | undefined,
	onFieldsChange: (fields: FormField[]) => void,
	onFieldSelect: (fieldId: string) => void,
) {
	const handleFieldDelete = useCallback(
		(fieldId: string) => {
			const fieldToDelete = fields.find((f) => f.id === fieldId);

			if (!fieldToDelete || !canDeleteField(fieldToDelete, fields)) {
				return;
			}

			if (selectedFieldId === fieldId) {
				onFieldSelect("");
			}

			const newFields = deleteFieldFromList(fields, fieldId);
			onFieldsChange(newFields);
		},
		[fields, selectedFieldId, onFieldsChange, onFieldSelect],
	);

	return { handleFieldDelete };
}

/** Hook for managing field column toggle */
function useColumnToggle(
	fields: FormField[],
	onFieldsChange: (fields: FormField[]) => void,
) {
	const handleColumnToggle = useCallback(
		(fieldId: string) => {
			const newFields = toggleFieldColumn(fields, fieldId);
			onFieldsChange(newFields);
		},
		[fields, onFieldsChange],
	);

	return { handleColumnToggle };
}

// ============================================================================
// Component
// ============================================================================

/**
 * FormCanvas displays and manages form fields with drag-drop
 */
export const FormCanvas = memo<FormCanvasProps>(function FormCanvas({
	fields,
	onFieldsChange,
	onFieldSelect,
	selectedFieldId,
	layout = "single-column",
	className: customClassName,
	...props
}) {
	// Hooks
	const {
		dragState,
		handleFieldDragStart,
		handleDragEnd,
		handleDropZoneDragOver,
		handleDropZoneDragLeave,
		handleDropZoneDrop,
	} = useDragAndDrop();

	const { handleFieldDelete } = useFieldDeletion(
		fields,
		selectedFieldId,
		onFieldsChange,
		onFieldSelect,
	);

	const { handleColumnToggle } = useColumnToggle(fields, onFieldsChange);

	// Derived state
	const isTwoColumn = layout === "two-column";

	const classNames = [
		styles.root,
		dragState.isDragging && styles.dragging,
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	// Handlers
	const handleDrop = useCallback(
		(index: number) => (e: React.DragEvent) => {
			const newFields = handleDropZoneDrop(index, fields)(e);
			if (newFields) {
				onFieldsChange(newFields);
			}
		},
		[handleDropZoneDrop, fields, onFieldsChange],
	);

	// Render
	return (
		<Stack gap="md" className={classNames} {...props}>
			<Stack gap="xs" className={styles.header}>
				<Text as="h3" size="md" weight="semibold">Form Builder</Text>
				<Text size="sm" color="muted">
					{fields.length === 0
						? "Drag fields here or click to add"
						: `${fields.length} field${fields.length !== 1 ? "s" : ""}`}
				</Text>
			</Stack>

			<div className={styles.canvas}>
				{fields.length === 0 ? (
					<div
						className={styles.emptyState}
						onDragOver={handleDropZoneDragOver(0)}
						onDragLeave={handleDropZoneDragLeave}
						onDrop={handleDrop(0)}
					>
						<Stack gap="md" align="center" justify="center">
							<Icon icon={GripVertical} size="2xl" color="muted" />
							<Text color="secondary">Drag fields from the left panel to start building your form</Text>
						</Stack>
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
									canDelete={canDeleteField(field, fields)}
									showColumnToggle={isTwoColumn}
									onColumnToggle={() => handleColumnToggle(field.id)}
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
		</Stack>
	);
});

FormCanvas.displayName = "FormCanvas";
