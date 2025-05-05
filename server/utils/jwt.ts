// server/utils/jwt.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET

export function signJWT(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export function verifyJWT(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) =>
      err ? reject(err) : resolve(decoded)
    )
  })
}
