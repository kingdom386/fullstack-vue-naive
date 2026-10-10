import type { Request, Response } from 'express'

interface User {
  id: number
  name: string
  email: string
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
]

export const getUsers = (_req: Request, res: Response) => {
  res.json({ success: true, data: users })
}

export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  const user = users.find(u => u.id === id)
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }
  res.json({ success: true, data: user })
}
