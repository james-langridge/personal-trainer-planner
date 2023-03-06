const {loadEnvConfig} = require('@next/env')
const contentfulManagement = require('contentful-management')

module.exports = async function () {
  loadEnvConfig(process.env.PWD)

  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  })

  return contentfulClient
    .getSpace(process.env.CONTENTFUL_SPACE_ID)
    .then(space => space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT))
}
