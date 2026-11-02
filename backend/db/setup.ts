import { readFile } from 'node:fs/promises'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const connection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}
const dbName = process.env.DB_NAME as string

const users = [
  { name: 'Administrador', email: 'admin@biblioteca.com', password: 'admin123', role: 'ADMIN' },
  { name: 'Ana Torres', email: 'ana@biblioteca.com', password: 'miembro123', role: 'MIEMBRO' },
  { name: 'Luis Pérez', email: 'luis@biblioteca.com', password: 'miembro123', role: 'MIEMBRO' },
]

const books: [string, string, string, number, number][] = [
  ['Cien años de soledad', 'Gabriel García Márquez', 'Novela', 1967, 3],
  ['El amor en los tiempos del cólera', 'Gabriel García Márquez', 'Novela', 1985, 2],
  ['Rayuela', 'Julio Cortázar', 'Novela', 1963, 0],
  ['Ficciones', 'Jorge Luis Borges', 'Cuento', 1944, 4],
  ['El Aleph', 'Jorge Luis Borges', 'Cuento', 1949, 2],
  ['Pedro Páramo', 'Juan Rulfo', 'Novela', 1955, 5],
  ['La casa de los espíritus', 'Isabel Allende', 'Novela', 1982, 3],
  ['Sangre sabia', "Flannery O'Connor", 'Novela', 1952, 2],
  ['Don Quijote de la Mancha', 'Miguel de Cervantes', 'Novela', 1605, 1],
  ['La sombra del viento', 'Carlos Ruiz Zafón', 'Novela', 2001, 4],
  ['1984', 'George Orwell', 'Ciencia ficción', 1949, 3],
  ['Un mundo feliz', 'Aldous Huxley', 'Ciencia ficción', 1932, 2],
  ['Fahrenheit 451', 'Ray Bradbury', 'Ciencia ficción', 1953, 3],
  ['Crónicas marcianas', 'Ray Bradbury', 'Ciencia ficción', 1950, 1],
  ['El principito', 'Antoine de Saint-Exupéry', 'Infantil', 1943, 6],
  ['Momo', 'Michael Ende', 'Infantil', 1973, 2],
  ['Clean Code', 'Robert C. Martin', 'Tecnología', 2008, 2],
  ['El programador pragmático', 'Andrew Hunt', 'Tecnología', 1999, 2],
  ['Sapiens', 'Yuval Noah Harari', 'Historia', 2011, 3],
  ['Los detectives salvajes', 'Roberto Bolaño', 'Novela', 1998, 2],
  ['La ciudad y los perros', 'Mario Vargas Llosa', 'Novela', 1963, 3],
  ['El túnel', 'Ernesto Sabato', 'Novela', 1948, 2],
  ['Como agua para chocolate', 'Laura Esquivel', 'Novela', 1989, 4],
  ['Veinte poemas de amor y una canción desesperada', 'Pablo Neruda', 'Poesía', 1924, 3],
]

async function createDatabase() {
  const client = new pg.Client({ ...connection, database: 'postgres' })
  await client.connect()
  const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
  if (!rowCount) {
    await client.query(`CREATE DATABASE "${dbName}"`)
    console.log(`Base de datos ${dbName} creada`)
  }
  await client.end()
}

async function seed() {
  const client = new pg.Client({ ...connection, database: dbName })
  await client.connect()

  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf-8')
  await client.query(schema)

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10)
    await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [user.name, user.email, hash, user.role]
    )
  }

  for (const [title, author, category, year, stock] of books) {
    await client.query(
      'INSERT INTO books (title, author, category, year, stock) VALUES ($1, $2, $3, $4, $5)',
      [title, author, category, year, stock]
    )
  }

  await client.query(`
    INSERT INTO loans (user_id, book_id, loan_date, due_date, returned_at) VALUES
      (2, 6, CURRENT_DATE - 3, CURRENT_DATE + 4, NULL),
      (2, 11, CURRENT_DATE - 30, CURRENT_DATE - 16, CURRENT_DATE - 18),
      (3, 4, CURRENT_DATE - 1, CURRENT_DATE + 6, NULL)
  `)

  await client.end()
  console.log(`Datos cargados: ${users.length} usuarios, ${books.length} libros, 3 préstamos`)
}

try {
  await createDatabase()
  await seed()
} catch (error) {
  console.error('No se pudo preparar la base de datos:', error)
  process.exit(1)
}
