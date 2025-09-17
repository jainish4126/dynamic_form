import { v4 as uuidv4 } from 'uuid';

// Default form schema used on first load
export const defaultForm = [
  {
    id: uuidv4(),
    type: 'title',
    label: 'Untitled Form',
    required: false,
  },
  {
    id: uuidv4(),
    type: 'text',
    label: 'Your Name',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    id: uuidv4(),
    type: 'dropdown',
    label: 'Country',
    options: ['India', 'USA', 'UK'],
    defaultValue: 'India',
    required: false,
  },
];
