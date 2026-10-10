import { asc, eq } from 'drizzle-orm'
import { db } from '../db/client.js'
import { users } from '../db/schema.js'

/** 对外暴露的字段，避免把 created_at 等内部字段泄露给客户端 */
const userColumns = { id: users.id, name: users.name, email: users.email }

export type UserRecord = { id: number; name: string; email: string }

export async function listUsers() {
  return db.select(userColumns).from(users).orderBy(asc(users.id))
}

export async function findUserById(id: number): Promise<UserRecord | undefined> {
  const rows = await db.select(userColumns).from(users).where(eq(users.id, id)).limit(1)
  return rows[0]
}