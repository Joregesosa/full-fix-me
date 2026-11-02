import pool from '../config/db.js'

export interface Loan {
  id: number
  user_id: number
  book_id: number
  title: string
  author: string
  loan_date: string
  due_date: string
  returned_at: string | null
}

const loanColumns = `
  l.id, l.user_id, l.book_id, b.title, b.author,
  to_char(l.loan_date, 'YYYY-MM-DD') AS loan_date,
  to_char(l.due_date, 'YYYY-MM-DD') AS due_date,
  to_char(l.returned_at, 'YYYY-MM-DD') AS returned_at
`

export async function getLoansByUser(userId: number) {
  const result = await pool.query<Loan>(
    `SELECT ${loanColumns}
     FROM loans l
     INNER JOIN books b ON b.id = l.book_id
     WHERE l.user_id = $1
     ORDER BY l.loan_date DESC, l.id DESC`,
    [userId]
  )
  return result.rows
}

export async function getLoanById(id: number) {
  const result = await pool.query<Loan>(
    `SELECT ${loanColumns}
     FROM loans l
     INNER JOIN books b ON b.id = l.book_id
     WHERE l.id = $1`,
    [id]
  )
  return result.rows[0] ?? null
}

export class OutOfStockError extends Error {}

export async function createLoan(userId: number, bookId: number, days: number) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const book = await client.query<{ stock: number }>(
      'SELECT stock FROM books WHERE id = $1 FOR UPDATE',
      [bookId]
    )
    if (!book.rows[0]) {
      await client.query('ROLLBACK')
      return null
    }
    if (book.rows[0].stock <= 0) {
      throw new OutOfStockError()
    }

    const inserted = await client.query<{ id: number }>(
      `INSERT INTO loans (user_id, book_id, due_date)
       VALUES ($1, $2, CURRENT_DATE + $3::int)
       RETURNING id`,
      [userId, bookId, days]
    )
    await client.query('UPDATE books SET stock = stock - 1 WHERE id = $1', [bookId])
    await client.query('COMMIT')

    return getLoanById(inserted.rows[0]!.id)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
