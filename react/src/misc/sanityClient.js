import { createClient } from '@sanity/client'

const projectId = 'd6ptjl8a'
const dataset = 'production'
const apiVersion = '2026-04-20' // use current date or a fixed API version
const token = 'skp4SyanmfhSiwArjVJH1X7yQ7Nbt0HZ3vV7TT0UTPA4gPQhihKrDNBbzb6xeRJV3x3BGxkG8Vy3MC00wG38PJZfy5YuYNaRSIyQa8Ug6MMmLoLMfrhzk0Taum1yFK0GoCybaFgcLYJVloqzxZRG5C0Hfrquxpkx9zX71oL0Wx12khDv7WZW'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  ignoreBrowserTokenWarning: true,
})

export default sanityClient
