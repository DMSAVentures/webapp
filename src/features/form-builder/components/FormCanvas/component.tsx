/**
 * FormCanvas Component
 * Drop zone for form fields with drag-drop reordering
 */

import { memo, useState, type HTMLAttributes, type DragEvent } from 'react';
import { IconOnlyButton } from '@/proto-design-system/Button/IconOnlyButton';
import type { FormField } from '@/types/common.types';
import styles from './component.module.scss';

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
 * Get field type icon
 */
const getFieldIcon = (type: FormField['type']): string => {
  const icons: Record<FormField['type'], string> = {
    email: 'ri-mail-line',
    text: 'ri-text',
    textarea: 'ri-file-text-line',
    select: 'ri-arrow-down-s-line',
    checkbox: 'ri-checkbox-line',
    radio: 'ri-radio-button-line',
    phone: 'ri-phone-line',
    url: 'ri-link',
    date: 'ri-calendar-line',
    number: 'ri-hashtag'
  };
  return icons[type];
};

/**
 * FormCanvas displays and manages form fields with drag-drop
 */
export const FormCanvas = memo<FormCanvasProps>(
  function FormCanvas({
    fields,
    onFieldsChange,
    onFieldSelect,
    selectedFieldId,
    className: customClassName,
    ...props
  }) {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const classNames = [
      styles.root,
      isDraggingOver && styles.draggingOver,
      customClassName
    ].filter(Boolean).join(' ');

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      // Only set to false if leaving the canvas entirely
      if (e.currentTarget === e.target) {
        setIsDraggingOver(false);
        setDragOverIndex(null);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      setDragOverIndex(null);

      const fieldType = e.dataTransfer.getData('fieldType') as FormField['type'];
      const draggedFieldId = e.dataTransfer.getData('fieldId');

      if (fieldType && !draggedFieldId) {
        // Adding new field from palette
        const newField: FormField = {
          id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: fieldType,
          label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
          placeholder: '',
          required: false,
          order: fields.length
        };
        onFieldsChange([...fields, newField]);
      }
    };

    const handleFieldDragStart = (e: DragEvent, fieldId: string) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('fieldId', fieldId);
    };

    const handleFieldDragOver = (e: DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
    };

    const handleFieldDrop = (e: DragEvent, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverIndex(null);

      const draggedFieldId = e.dataTransfer.getData('fieldId');

      if (draggedFieldId) {
        // Reordering existing field
        const draggedIndex = fields.findIndex(f => f.id === draggedFieldId);
        if (draggedIndex !== -1 && draggedIndex !== dropIndex) {
          const newFields = [...fields];
          const [draggedField] = newFields.splice(draggedIndex, 1);
          newFields.splice(dropIndex, 0, draggedField);

          // Update order property
          const updatedFields = newFields.map((field, idx) => ({
            ...field,
            order: idx
          }));

          onFieldsChange(updatedFields);
        }
      }
    };

    const handleDeleteField = (fieldId: string) => {
      const newFields = fields
        .filter(f => f.id !== fieldId)
        .map((field, idx) => ({ ...field, order: idx }));
      onFieldsChange(newFields);
    };

    return (
      <div
        className={classNames}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...props}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Form Builder</h3>
          <p className={styles.subtitle}>
            {fields.length === 0 ? 'Drag fields here or click to add' : `${fields.length} field${fields.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className={styles.canvas}>
          {fields.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="ri-drag-drop-line" aria-hidden="true" />
              <p>Drag fields from the left panel to start building your form</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className={`${styles.fieldItem} ${selectedFieldId === field.id ? styles.selected : ''} ${dragOverIndex === index ? styles.dragOver : ''}`}
                draggable
                onDragStart={(e) => handleFieldDragStart(e, field.id)}
                onDragOver={(e) => handleFieldDragOver(e, index)}
                onDrop={(e) => handleFieldDrop(e, index)}
                onClick={() => onFieldSelect(field.id)}
                role="button"
                tabIndex={0}
                aria-label={`${field.label} field`}
              >
                <div className={styles.dragHandle}>
                  <i className="ri-draggable" aria-hidden="true" />
                </div>

                <div className={styles.fieldContent}>
                  <div className={styles.fieldHeader}>
                    <i className={getFieldIcon(field.type)} aria-hidden="true" />
                    <span className={styles.fieldLabel}>
                      {field.label}
                      {field.required && <span className={styles.required}>*</span>}
                    </span>
                    <span className={styles.fieldType}>{field.type}</span>
                  </div>
                  {field.placeholder && (
                    <span className={styles.fieldPlaceholder}>{field.placeholder}</span>
                  )}
                </div>

                <div className={styles.fieldActions}>
                  <IconOnlyButton
                    iconClass="delete-bin-line"
                    variant="tertiary"
                    size="small"
                    ariaLabel="Delete field"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteField(field.id);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

FormCanvas.displayName = 'FormCanvas';
