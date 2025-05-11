import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'

export function signJWT(payload: object): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' })
}

export function verifyJWT(token: string): any {
  return jwt.verify(token, jwtSecret)
}
