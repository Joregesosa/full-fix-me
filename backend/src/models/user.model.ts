import pool from '../config/db.js'

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'MIEMBRO'
}

export async function getUserByEmail(email: string) {
  const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0] ?? null
}
