export const bachelordegree = {
  name: 'bachelordegree',
  type: 'document',
  title: 'Bachelor Degree',
  fields: [
    {
      name: 'bachelorname',
      type: 'string',
      title: 'Bachelor Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'bachelorcode',
      type: 'string',
      title: 'Bachelor Code',
      validation: Rule => Rule.required()
    },
    {
      name: 'bachelorresponsible',
      type: 'reference',
      title: 'Bachelor Responsible',
      to: [{type: 'people'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'courses',
      type: 'array',
      title: 'Courses',
      of: [
        {
          type: 'bachelorcourses'
        }
      ]
    }
  ]
}