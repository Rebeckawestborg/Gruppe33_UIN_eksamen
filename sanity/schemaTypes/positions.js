export const positions = {
  name: 'positions',
  type: 'document',
  title: 'Positions',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Position Name',
      validation: Rule => Rule.required()
    }
  ]
}