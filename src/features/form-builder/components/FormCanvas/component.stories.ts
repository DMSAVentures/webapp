/**
 * FormCanvas Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FormCanvas } from './component';
import { mockFormFields } from '@/mocks/forms.mock';
import { useState } from 'react';

const meta = {
  title: 'Features/FormBuilder/FormCanvas',
  component: FormCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    fields: {
      description: 'Array of form fields',
      control: 'object',
    },
    onFieldsChange: {
      description: 'Callback when fields change',
      action: 'fields-changed',
    },
    onFieldSelect: {
      description: 'Callback when a field is selected',
      action: 'field-selected',
    },
    selectedFieldId: {
      description: 'Currently selected field ID',
      control: 'text',
    },
  },
} satisfies Meta<typeof FormCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty canvas (no fields)
 */
export const Empty: Story = {
  args: {
    fields: [],
    selectedFieldId: undefined,
  },
};

/**
 * Canvas with minimal fields
 */
export const Minimal: Story = {
  args: {
    fields: mockFormFields.minimal,
    selectedFieldId: undefined,
  },
};

/**
 * Canvas with standard fields
 */
export const Standard: Story = {
  args: {
    fields: mockFormFields.standard,
    selectedFieldId: mockFormFields.standard[0].id,
  },
};

/**
 * Canvas with comprehensive form
 */
export const Comprehensive: Story = {
  args: {
    fields: mockFormFields.comprehensive,
    selectedFieldId: undefined,
  },
};

/**
 * Canvas with multi-step fields
 */
export const MultiStep: Story = {
  args: {
    fields: mockFormFields.multiStep,
    selectedFieldId: undefined,
  },
};

/**
 * Canvas with conditional logic fields
 */
export const WithConditionalLogic: Story = {
  args: {
    fields: mockFormFields.withConditionalLogic,
    selectedFieldId: undefined,
  },
};

/**
 * Interactive canvas with state management
 */
export const Interactive: Story = {
  render: () => {
    const [fields, setFields] = useState(mockFormFields.standard);
    const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);

    return {
      type: 'div',
      props: {
        style: {
          minHeight: '600px',
        },
        children: {
          type: FormCanvas,
          props: {
            fields,
            onFieldsChange: (newFields: typeof fields) => {
              console.log('Fields changed:', newFields);
              setFields(newFields);
            },
            onFieldSelect: (fieldId: string) => {
              console.log('Field selected:', fieldId);
              setSelectedFieldId(fieldId);
            },
            selectedFieldId,
          },
        },
      },
    };
  },
};

/**
 * Canvas in constrained container
 */
export const Constrained: Story = {
  args: {
    fields: mockFormFields.standard,
    selectedFieldId: undefined,
  },
  decorators: [
    (Story) => ({
      type: 'div',
      props: {
        style: {
          height: '500px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
        },
        children: { type: Story, props: {} },
      },
    }),
  ],
};

/**
 * Canvas with selected field
 */
export const WithSelection: Story = {
  args: {
    fields: mockFormFields.comprehensive,
    selectedFieldId: mockFormFields.comprehensive[2].id,
  },
};
