import express, { type Request, type Response } from 'express'
import cors from 'cors'
import swaggerRouter from './routes/swagger.routes.js'
import authRouter from './routes/auth.routes.js'
import bookRouter from './routes/book.routes.js'
import loanRouter from './routes/loan.routes.js'

const port = process.env.PORT

const app = express()

app.use(cors({ origin: 'http://localhost:5137' }))

app.use('/api/docs', swaggerRouter)

app.get('/', (req: Request, res: Response) => {
  /* #swagger.tags = ['Status'] */
  res.json({ status: 'Server online', version: '1.0.0' })
})

app.use('/api/auth', authRouter)
app.use(express.json())
app.use('/api/books', bookRouter)
app.use('/api/loans', loanRouter)

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`)
  console.log(`Docs: http://localhost:${port}/api/docs`)
})
