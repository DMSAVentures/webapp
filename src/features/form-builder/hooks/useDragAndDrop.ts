/**
 * useDragAndDrop Hook
 * Manages drag and drop state and logic for form builder
 */

import { useState, useCallback, DragEvent } from 'react';
import type { FormField } from '@/types/common.types';

export interface DragState {
	isDragging: boolean;
	draggedFieldId: string | null;
	draggedFieldType: FormField['type'] | null;
	dropTargetIndex: number | null;
}

export interface UseDragAndDropReturn {
	dragState: DragState;
	handlePaletteDragStart: (fieldType: FormField['type']) => (e: DragEvent) => void;
	handleFieldDragStart: (fieldId: string) => (e: DragEvent) => void;
	handleDragEnd: () => void;
	handleDropZoneDragOver: (index: number) => (e: DragEvent) => void;
	handleDropZoneDragLeave: () => void;
	handleDropZoneDrop: (index: number, fields: FormField[]) => (e: DragEvent) => FormField[] | null;
}

/**
 * Custom hook for managing drag and drop operations in form builder
 */
export const useDragAndDrop = (): UseDragAndDropReturn => {
	const [dragState, setDragState] = useState<DragState>({
		isDragging: false,
		draggedFieldId: null,
		draggedFieldType: null,
		dropTargetIndex: null,
	});

	/**
	 * Start dragging a field type from the palette
	 */
	const handlePaletteDragStart = useCallback((fieldType: FormField['type']) => {
		return (e: DragEvent) => {
			e.dataTransfer.effectAllowed = 'copy';
			e.dataTransfer.setData('fieldType', fieldType);
			e.dataTransfer.setData('source', 'palette');

			setDragState({
				isDragging: true,
				draggedFieldId: null,
				draggedFieldType: fieldType,
				dropTargetIndex: null,
			});
		};
	}, []);

	/**
	 * Start dragging an existing field for reordering
	 */
	const handleFieldDragStart = useCallback((fieldId: string) => {
		return (e: DragEvent) => {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('fieldId', fieldId);
			e.dataTransfer.setData('source', 'canvas');

			setDragState({
				isDragging: true,
				draggedFieldId: fieldId,
				draggedFieldType: null,
				dropTargetIndex: null,
			});
		};
	}, []);

	/**
	 * End dragging operation
	 */
	const handleDragEnd = useCallback(() => {
		setDragState({
			isDragging: false,
			draggedFieldId: null,
			draggedFieldType: null,
			dropTargetIndex: null,
		});
	}, []);

	/**
	 * Handle drag over a drop zone
	 */
	const handleDropZoneDragOver = useCallback((index: number) => {
		return (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const source = e.dataTransfer.getData('source') ||
				(e.dataTransfer.types.includes('fieldtype') ? 'palette' : 'canvas');

			e.dataTransfer.dropEffect = source === 'palette' ? 'copy' : 'move';

			setDragState(prev => ({
				...prev,
				dropTargetIndex: index,
			}));
		};
	}, []);

	/**
	 * Handle drag leave from drop zone
	 */
	const handleDropZoneDragLeave = useCallback(() => {
		setDragState(prev => ({
			...prev,
			dropTargetIndex: null,
		}));
	}, []);

	/**
	 * Handle drop on a drop zone
	 * Returns new fields array or null if drop was invalid
	 */
	const handleDropZoneDrop = useCallback((index: number, currentFields: FormField[]) => {
		return (e: DragEvent): FormField[] | null => {
			e.preventDefault();
			e.stopPropagation();

			const fieldId = e.dataTransfer.getData('fieldId');
			const fieldType = e.dataTransfer.getData('fieldType') as FormField['type'];

			// Reset drag state
			setDragState({
				isDragging: false,
				draggedFieldId: null,
				draggedFieldType: null,
				dropTargetIndex: null,
			});

			// Case 1: Adding new field from palette
			if (fieldType && !fieldId) {
				return addNewFieldAtIndex(currentFields, fieldType, index);
			}

			// Case 2: Reordering existing field
			if (fieldId && !fieldType) {
				return reorderField(currentFields, fieldId, index);
			}

			return null;
		};
	}, []);

	return {
		dragState,
		handlePaletteDragStart,
		handleFieldDragStart,
		handleDragEnd,
		handleDropZoneDragOver,
		handleDropZoneDragLeave,
		handleDropZoneDrop,
	};
};

/**
 * Add a new field at the specified index
 */
function addNewFieldAtIndex(
	fields: FormField[],
	fieldType: FormField['type'],
	index: number
): FormField[] {
	const newField: FormField = {
		id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		type: fieldType,
		label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
		placeholder: '',
		required: false,
		order: index,
	};

	const newFields = [...fields];
	newFields.splice(index, 0, newField);

	// Update order for all fields
	return newFields.map((field, idx) => ({
		...field,
		order: idx,
	}));
}

/**
 * Reorder an existing field to a new index
 */
function reorderField(
	fields: FormField[],
	fieldId: string,
	targetIndex: number
): FormField[] {
	const sourceIndex = fields.findIndex(f => f.id === fieldId);

	if (sourceIndex === -1) {
		return fields; // Field not found
	}

	if (sourceIndex === targetIndex) {
		return fields; // No change needed
	}

	const newFields = [...fields];
	const [movedField] = newFields.splice(sourceIndex, 1);

	// Calculate adjusted target index
	// When moving down, we need to adjust because we've already removed the item
	const adjustedIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;

	newFields.splice(adjustedIndex, 0, movedField);

	// Update order for all fields
	return newFields.map((field, idx) => ({
		...field,
		order: idx,
	}));
}
