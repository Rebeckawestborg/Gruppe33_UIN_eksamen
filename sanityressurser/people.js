export const people = {
  name: 'people',
  type: 'document',
  title: 'People',
  fields: [
    {
      name: 'firstname',
      type: 'string',
      title: 'First Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'lastname',
      type: 'string',
      title: 'Last Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'position',
      type: 'array',
      title: 'Positions',
      of: [
        {
          type: 'reference',
          to: [{type: 'positions'}]
        }
      ]
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'office',
      type: 'string',
      title: 'Office'
    },
    {
      name: 'profileImage',
      type: 'image',
      title: 'Profile Image',
      options: { hotspot: true }
    }
  ]
}