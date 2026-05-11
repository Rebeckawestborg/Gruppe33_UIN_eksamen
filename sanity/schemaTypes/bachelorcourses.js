export const bachelorcourses = {
  name: 'bachelorcourses',
  type: 'object',
  title: 'Bachelor Course',
  fields: [
    {
      name: 'course',
      type: 'reference',
      title: 'Course',
      to: [{type: 'course'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'year',
      type: 'number',
      title: 'Year',
      validation: Rule => Rule.required().min(1).max(3)
    },
    {
      name: 'semester',
      type: 'number',
      title: 'Semester',
      validation: Rule => Rule.required().min(1).max(2)
    }
  ],
  preview: {
    select: {
      courseName: 'course.coursename',
      year: 'year',
      semester: 'semester'
    },
    prepare(selection) {
      const { courseName, year, semester } = selection
      return {
        title: courseName || 'Untitled Course',
        subtitle: `Year ${year}, Semester ${semester}`
      }
    }
  }
}