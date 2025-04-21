import CryptoJS from 'crypto-js'

const secretKey = import.meta.env.VITE_WALLET_SECRET_KEY

export const decryptWalletData = ({encryptedData, iv})=> {
  
    if (!encryptedData ||encryptedData.iv){
        return null
    }
    const key = CryptoJS.enc.Utf8.parse(secretKey)
    const ivBytes = CryptoJS.enc.Hex.parse(iv)
    const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedData)
    
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedBytes },
      key,
      {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )   
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8) 
    return JSON.parse(decryptedText)
}
