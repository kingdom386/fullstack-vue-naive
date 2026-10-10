import type { Request, Response } from 'express'
import { findUserById, listUsers } from '../repositories/userRepository.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await listUsers()
  res.json({ success: true, data: users })
}

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  // 非整数 id 直接拒绝，避免把 NaN 传入 SQL 参数
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, error: 'Invalid user id' })
  }

  const user = await findUserById(id)
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }
  res.json({ success: true, data: user })
}
