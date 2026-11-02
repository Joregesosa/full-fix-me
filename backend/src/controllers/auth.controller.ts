import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getUserByEmail } from '../models/user.model.js'

export async function login(req: Request, res: Response) {
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Inicia sesión y devuelve un token JWT'
     #swagger.requestBody = {
       required: true,
       content: { "application/json": { example: { email: "ana@biblioteca.com", password: "miembro123" } } }
     } */
  try {
    const { email, password } = req.body
    const user = await getUserByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )
    res.json({
      token,
      usuario: { id: user.id, nombre: user.name, email: user.email, rol: user.role },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al iniciar sesión' })
  }
}
