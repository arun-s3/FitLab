const crypto = require('crypto')

const secretKey = process.env.WALLET_SECRET_KEY
const algorithm = 'aes-256-cbc'

function encryptData(data){
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv)
  let encrypted = cipher.update(JSON.stringify(data))
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  }
}

module.exports = {encryptData}
