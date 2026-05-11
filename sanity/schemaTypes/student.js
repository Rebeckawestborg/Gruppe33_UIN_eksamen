export const student = {
  name: 'student',
  type: 'document',
  title: 'Student',
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
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'bachelorprogram',
      type: 'reference',
      title: 'Bachelor Program',
      to: [{type: 'bachelordegree'}],
      validation: Rule => Rule.required()
    }
  ]
}
