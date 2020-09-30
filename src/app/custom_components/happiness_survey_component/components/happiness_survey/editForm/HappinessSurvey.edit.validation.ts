export default [
  {
    type: 'number',
    input: true,
    key: 'validate.minSelectedCount',
    label: 'Minimum checked number',
    tooltip: 'Minimum checkboxes required before form can be submitted.',
    weight: 250
  },
  {
    type: 'textfield',
    input: true,
    key: 'minSelectedCountMessage',
    label: 'Minimum checked error message',
    tooltip: 'Error message displayed if minimum number of items not checked.',
    weight: 250
  },
  {
    weight: 10,
    type: 'checkbox',
    label: 'Required',
    tooltip: 'A required field must be filled in before the form can be submitted.',
    key: 'validate.required',
    input: true
  },
];
