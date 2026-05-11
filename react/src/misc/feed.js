import sanityClient from './sanityClient.js'

const positions = [
  'principal',
  'dean',
  'professor',
  'assistant professor',
  'teacher',
  'research assistant',
  'PhD fellow',
]

const people = [
  'Ava Morgan',
  'Noah Patel',
  'Sophia Carter',
  'Liam Johnson',
  'Emma Nguyen',
  'Mason Kim',
  'Olivia Brown',
  'Ethan Martinez',
  'Isabella Thompson',
  'Lucas Clark',
  'Mia Davis',
  'Oliver Wilson',
  'Amelia Rodriguez',
  'Elijah Lee',
  'Charlotte Walker',
  'William Harris',
  'Harper Young',
  'James Lewis',
  'Evelyn Hall',
  'Benjamin Allen',
  'Abigail Scott',
  'Henry Adams',
  'Emily Turner',
  'Alexander Baker',
  'Ella Nelson',
  'Sebastian Perez',
  'Grace Rivera',
  'Owen Brooks',
  'Scarlett Murphy',
  'Jack Bennett',
  'Aria Cooper',
  'Samuel Foster',
  'Lily Reed',
  'Daniel Parker',
  'Zoe Richardson',
  'Matthew Bell',
  'Nora Ward',
  'Wyatt Simmons',
  'Chloe Gray',
]

const courseDefinitions = [
  { name: 'Machine Learning Fundamentals', code: 'ML101' },
  { name: 'Applied Machine Learning', code: 'ML102' },
  { name: 'Deep Learning and Neural Networks', code: 'ML201' },
  { name: 'Natural Language Processing', code: 'ML202' },
  { name: 'Computer Vision', code: 'ML203' },
  { name: 'Statistical Learning', code: 'ML204' },
  { name: 'Ethics in AI', code: 'ML205' },
  { name: 'Reinforcement Learning', code: 'ML301' },
  { name: 'Data Mining', code: 'ML302' },
  { name: 'Probabilistic Models', code: 'ML303' },
  { name: 'Human-Computer Interaction', code: 'HT101' },
  { name: 'Design Thinking', code: 'HT102' },
  { name: 'Technology and Society', code: 'HT103' },
  { name: 'Digital Health Systems', code: 'HT104' },
  { name: 'Cybersecurity Awareness', code: 'HT105' },
  { name: 'Usability Engineering', code: 'HT106' },
  { name: 'Interaction Design', code: 'HT107' },
  { name: 'Augmented Reality Systems', code: 'HT108' },
  { name: 'Social Media Technology', code: 'HT109' },
  { name: 'Responsible Innovation', code: 'HT110' },
  { name: 'Software Design Patterns', code: 'SD101' },
  { name: 'Web Application Development', code: 'SD102' },
  { name: 'Mobile Application Development', code: 'SD103' },
  { name: 'Backend Architecture', code: 'SD104' },
  { name: 'Frontend Frameworks', code: 'SD105' },
  { name: 'Software Testing', code: 'SD106' },
  { name: 'DevOps and CI/CD', code: 'SD107' },
  { name: 'Databases and Storage', code: 'SD108' },
  { name: 'Cloud-Native Software', code: 'SD109' },
  { name: 'Agile Software Development', code: 'SD110' },
]

const bachelorDefinitions = [
  {
    name: 'Machine Learning',
    code: 'BSC-ML',
    courses: [
      'ML101', 'ML102', 'ML201', 'ML202', 'ML203', 'ML204', 'ML205', 'ML301', 'ML302', 'ML303',
    ],
  },
  {
    name: 'Humans and technology',
    code: 'BSC-HT',
    courses: [
      'HT101', 'HT102', 'HT103', 'HT104', 'HT105', 'HT106', 'HT107', 'HT108', 'HT109', 'HT110',
    ],
  },
  {
    name: 'Software development',
    code: 'BSC-SD',
    courses: [
      'SD101', 'SD102', 'SD103', 'SD104', 'SD105', 'SD106', 'SD107', 'SD108', 'SD109', 'SD110',
    ],
  },
]

function makeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function splitName(name) {
  const [firstname, lastname] = name.split(' ')
  return { firstname, lastname }
}

async function emptyDatabase() {
  await sanityClient.delete({ query: '*[_type in ["people", "positions", "course", "bachelordegree", "student"]]' })
}

async function seed() {


  console.log('Cleaning database...')
  await emptyDatabase()
  console.log('Database cleared.')

  console.log('Creating positions...')
  const positionDocs = positions.map((position) => ({
    _id: `position.${makeId(position)}`,
    _type: 'positions',
    name: position,
  }))
  await Promise.all(positionDocs.map((doc) => sanityClient.create(doc)))

  const positionMap = positionDocs.reduce((map, positionDoc) => {
    map[positionDoc.name] = { _type: 'reference', _ref: positionDoc._id }
    return map
  }, {})

  console.log('Creating people...')
  const fixedRoles = {
    principal: 1,
    dean: 3,
  }
  const randomRoles = ['professor', 'assistant professor', 'teacher', 'research assistant', 'PhD fellow']
  
  const peopleDocs = []
  let currentIndex = 0

  // Create people with fixed roles first
  for (const [role, count] of Object.entries(fixedRoles)) {
    for (let i = 0; i < count; i += 1) {
      const name = people[currentIndex] || `Person ${currentIndex}`
      const { firstname, lastname } = splitName(name)
      peopleDocs.push({
        _id: `people.${makeId(name)}`,
        _type: 'people',
        firstname,
        lastname,
        position: [{ _key: `${makeId(role)}-${i}`, ...positionMap[role] }],
        email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@actm.uni`,
        office: `Room ${100 + currentIndex}`,
      })
      currentIndex++
    }
  }

  // Assign random roles to remaining people
  while (currentIndex < people.length) {
    const name = people[currentIndex] || `Person ${currentIndex}`
    const { firstname, lastname } = splitName(name)
    const randomRole = randomRoles[Math.floor(Math.random() * randomRoles.length)]
    peopleDocs.push({
      _id: `people.${makeId(name)}`,
      _type: 'people',
      firstname,
      lastname,
      position: [{ _key: `position-${currentIndex}`, ...positionMap[randomRole] }],
      email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@actm.uni`,
      office: `Room ${100 + currentIndex}`,
    })
    currentIndex++
  }

  await Promise.all(peopleDocs.map((doc) => sanityClient.create(doc)))

  const peopleMap = peopleDocs.reduce((map, doc) => {
    map[doc._id] = { _type: 'reference', _ref: doc._id }
    return map
  }, {})

  const teacherPool = peopleDocs.filter((doc) => ['professor', 'assistant professor', 'teacher'].includes(doc.position[0]._ref.replace('position.', '')))
  const assistantPool = peopleDocs.filter((doc) => ['research assistant', 'PhD fellow', 'teacher'].includes(doc.position[0]._ref.replace('position.', '')))
  const responsiblePool = peopleDocs.filter((doc) => ['professor', 'assistant professor', 'teacher'].includes(doc.position[0]._ref.replace('position.', '')))

  console.log('Creating courses...')
  const courseDocs = courseDefinitions.map((course, index) => {
    const responsibles = responsiblePool.slice(index % responsiblePool.length, (index % responsiblePool.length) + 1)
    const teachers = [teacherPool[(index * 2) % teacherPool.length], teacherPool[(index * 2 + 1) % teacherPool.length]]
    const assistants = [assistantPool[(index * 3) % assistantPool.length]]

    return {
      _id: `course.${course.code.toLowerCase()}`,
      _type: 'course',
      coursename: course.name,
      coursecode: course.code,
      courseResponsible: peopleMap[responsibles[0]._id],
      teachers: teachers.map((teacher, i) => ({ _key: `teacher-${i}`, ...peopleMap[teacher._id] })),
      teacherAssistants: assistants.map((assistant, i) => ({ _key: `assistant-${i}`, ...peopleMap[assistant._id] })),
    }
  })
  await Promise.all(courseDocs.map((doc) => sanityClient.create(doc)))

  const courseMap = courseDocs.reduce((map, doc) => {
    map[doc.coursecode] = { _type: 'reference', _ref: doc._id }
    return map
  }, {})

  console.log('Creating bachelor degrees...')
  const bachelorDocs = bachelorDefinitions.map((bachelor) => {
    const assignedCourses = []
    let courseIndex = 0
    for (let year = 1; year <= 3; year++) {
      for (let semester = 1; semester <= 2; semester++) {
        for (let i = 0; i < 3; i++) {
          const courseCode = bachelor.courses[courseIndex % bachelor.courses.length]
          assignedCourses.push({
            _key: `${year}-${semester}-${i}`,
            _type: 'bachelorcourses',
            course: courseMap[courseCode],
            year,
            semester,
          })
          courseIndex++
        }
      }
    }

    const responsiblePerson = responsiblePool[Math.floor(Math.random() * responsiblePool.length)]
    return {
      _id: `bachelordegree.${makeId(bachelor.name)}`,
      _type: 'bachelordegree',
      bachelorname: bachelor.name,
      bachelorcode: bachelor.code,
      bachelorresponsible: peopleMap[responsiblePerson._id],
      courses: assignedCourses,
    }
  })

  await Promise.all(bachelorDocs.map((doc) => sanityClient.create(doc)))

  const bachelorMap = bachelorDocs.reduce((map, doc) => {
    map[doc._id] = { _type: 'reference', _ref: doc._id }
    return map
  }, {})

  const studentFirstNames = [
    'Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Avery', 'Quinn', 'Cameron', 'Skylar',
    'Dakota', 'Austin', 'Blake', 'Drew', 'Easton', 'Finley', 'Greyson', 'Harper', 'Hayden', 'Hunter',
    'Indigo', 'Jaxon', 'Kaiser', 'Lane', 'Milan', 'Nolan', 'Owen', 'Parker', 'Quinton', 'Reese',
    'Sage', 'Tatum', 'Urban', 'Vale', 'Wells', 'Xavier', 'Yael', 'Zephyr', 'Asher', 'River',
    'Sage', 'Cypress', 'Devon', 'Elliot', 'Forest', 'Gray', 'Harbor', 'Indigo', 'Jasper', 'Kade',
  ]

  const studentLastNames = [
    'Anderson', 'Bennett', 'Carter', 'Davidson', 'Edwards', 'Foster', 'Garcia', 'Harrison', 'Irving', 'Jensen',
    'Knight', 'Lambert', 'Mitchell', 'Nelson', 'O\'Brien', 'Patterson', 'Quinn', 'Richardson', 'Sullivan', 'Thompson',
    'Underwood', 'Valencia', 'Wagner', 'Xavier', 'Young', 'Zimmerman', 'Abbott', 'Bradley', 'Chapman', 'Dawson',
  ]

  console.log('Creating students...')
  const studentDocs = []
  for (let i = 0; i < 50; i++) {
    const firstname = studentFirstNames[i % studentFirstNames.length]
    const lastname = studentLastNames[Math.floor(Math.random() * studentLastNames.length)]
    const randomBachelor = bachelorDocs[Math.floor(Math.random() * bachelorDocs.length)]
    
    studentDocs.push({
      _id: `student.${i + 1}`,
      _type: 'student',
      firstname,
      lastname,
      email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}${i}@actm.uni`,
      bachelorprogram: bachelorMap[randomBachelor._id],
    })
  }

  await Promise.all(studentDocs.map((doc) => sanityClient.create(doc)))

  console.log('Database seeded successfully.')
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
