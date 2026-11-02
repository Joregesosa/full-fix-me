import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'API Biblioteca Comunitaria',
    description: 'Catálogo de libros y préstamos de la Biblioteca Comunitaria',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
}

const outputFile = 'swagger-output.json'
const endpointsFiles = ['./src/index.ts']

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(async () => {
  await import('../index.js')
})
