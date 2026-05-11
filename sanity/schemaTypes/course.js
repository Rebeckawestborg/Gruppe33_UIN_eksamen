export const course = {
  name: 'course',
  type: 'document',
  title: 'Course',
  fields: [
    {
      name: 'coursename',
      type: 'string',
      title: 'Course Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'coursecode',
      type: 'string',
      title: 'Course Code',
      validation: Rule => Rule.required()
    },
    {
      name: 'courseResponsible',
      type: 'reference',
      title: 'Course Responsible',
      to: [{type: 'people'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'teachers',
      type: 'array',
      title: 'Teachers',
      of: [
        {
          type: 'reference',
          to: [{type: 'people'}]
        }
      ]
    },
    {
      name: 'teacherAssistants',
      type: 'array',
      title: 'Teacher Assistants',
      of: [
        {
          type: 'reference',
          to: [{type: 'people'}]
        }
      ]
    }
  ]
}