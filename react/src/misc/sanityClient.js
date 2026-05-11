import { createClient } from '@sanity/client'

const projectId = 'YOUR_PROJECT_ID'
const dataset = 'production'
const apiVersion = '2026-04-20' // use current date or a fixed API version
const token = 'YOUR_API_TOKEN'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  ignoreBrowserTokenWarning: true,
})

export default sanityClient
