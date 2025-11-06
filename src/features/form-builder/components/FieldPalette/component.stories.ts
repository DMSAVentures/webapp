/**
 * FieldPalette Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FieldPalette } from './component';

const meta = {
  title: 'Features/FormBuilder/FieldPalette',
  component: FieldPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onFieldSelect: {
      description: 'Callback when a field type is selected',
      action: 'field-selected',
    },
  },
} satisfies Meta<typeof FieldPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default field palette with all field types
 */
export const Default: Story = {
  args: {},
};

/**
 * Field palette in a constrained container
 */
export const Constrained: Story = {
  decorators: [
    (Story) => ({
      type: 'div',
      props: {
        style: {
          width: '280px',
          height: '600px',
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
 * Field palette with interactive demo
 */
export const Interactive: Story = {
  render: (args) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        gap: '24px',
        minHeight: '600px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '280px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
            },
            children: {
              type: FieldPalette,
              props: {
                ...args,
                onFieldSelect: (fieldType: string) => {
                  console.log('Selected field:', fieldType);
                  alert(`Field selected: ${fieldType}`);
                },
              },
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '14px',
            },
            children: 'Click or drag a field from the palette',
          },
        },
      ],
    },
  }),
};
