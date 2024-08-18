import nacl from "tweetnacl"
import { Buffer } from "buffer"
import elliptic from "elliptic"
const ec = elliptic.ec

/**
 * Derives a shared secret using elliptic curve Diffie-Hellman (ECDH).
 *
 * @param {string} publicKeyHex - The recipient's public key in hexadecimal format.
 * @param {string} privateKeyHex - The sender's private key in hexadecimal format.
 * @returns {Buffer} The derived shared secret as a buffer.
 */
const getSharedSecret = (publicKeyHex, privateKeyHex) => {
    const secp256k1 = new ec("secp256k1")
    const senderEcKey = secp256k1.keyFromPrivate(privateKeyHex.slice(2), "hex")
    const recipientEcKey = secp256k1.keyFromPublic(publicKeyHex.slice(2), "hex")
    const sharedSecret = senderEcKey.derive(recipientEcKey.getPublic())
    return Buffer.from(sharedSecret.toArray("be", 32))
}

/**
 * Encrypts a text message using NaCl's box method with a shared secret.
 *
 * @param {string} text - The text message to encrypt.
 * @param {string} recipientPublicKey - The recipient's public key in hexadecimal format.
 * @param {string} senderPrivateKey - The sender's private key in hexadecimal format.
 * @returns {Object} An object containing the nonce and encrypted message as hexadecimal strings.
 */
export const encryptText = (text, recipientPublicKey, senderPrivateKey) => {
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey)
    const nonce = nacl.randomBytes(24)
    const encrypted = nacl.box.after(Buffer.from(text), nonce, sharedSecret)

    return {
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
    }
}

/**
 * Decrypts a text message encrypted with NaCl's box method.
 *
 * @param {string} encryptedMessage - The encrypted message as a hexadecimal string.
 * @param {string} senderPublicKey - The sender's public key in hexadecimal format.
 * @param {string} recipientPrivateKey - The recipient's private key in hexadecimal format.
 * @returns {string} The decrypted message, or "error" if decryption fails.
 */
export const decryptText = (
    encryptedMessage,
    senderPublicKey,
    recipientPrivateKey,
) => {
    if (!encryptedMessage || typeof encryptedMessage !== "string") {
        console.error("Invalid encrypted message:", encryptedMessage)
        return "error"
    }

    if (!encryptedMessage.startsWith("{")) {
        return Buffer.from(encryptedMessage, "hex").toString()
    }

    const encryptedObj = JSON.parse(encryptedMessage)
    try {
        const sharedSecret = getSharedSecret(
            senderPublicKey,
            recipientPrivateKey,
        )
        const { nonce, encrypted } = encryptedObj

        if (!nonce || !encrypted) {
            console.error("Invalid nonce or encrypted data:", nonce, encrypted)
            return "error"
        }

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret,
        )

        if (decrypted) {
            const decryptedMessage = Buffer.from(decrypted).toString()
            console.log("Decrypted message:", decryptedMessage)
            return decryptedMessage
        } else {
            console.error(
                "Decryption failed. Check keys, nonce, and encrypted values.",
            )
            return "error"
        }
    } catch (error) {
        console.error("Decryption process error:", error)
        return "error"
    }
}

/**
 * Encrypts a file using NaCl's box method with a shared secret.
 *
 * @param {Buffer} fileBuffer - The file data to encrypt as a buffer.
 * @param {string} recipientPublicKey - The recipient's public key in hexadecimal format.
 * @param {string} senderPrivateKey - The sender's private key in hexadecimal format.
 * @returns {string} A JSON string containing the nonce and encrypted file data as hexadecimal strings.
 */
export const encryptFile = (
    fileBuffer,
    recipientPublicKey,
    senderPrivateKey,
) => {
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey)

    if (!(fileBuffer instanceof Buffer)) {
        throw new Error("Input must be a Buffer")
    }

    const nonce = nacl.randomBytes(24)
    const encrypted = nacl.box.after(fileBuffer, nonce, sharedSecret)

    const encryptedObj = {
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
    }

    return JSON.stringify(encryptedObj)
}

/**
 * Decrypts a file encrypted with NaCl's box method.
 *
 * @param {string} encryptedMessage - The encrypted file data as a JSON string or hexadecimal string.
 * @param {string} senderPublicKey - The sender's public key in hexadecimal format.
 * @param {string} recipientPrivateKey - The recipient's private key in hexadecimal format.
 * @returns {string|null} A URL pointing to the decrypted file, or null if decryption fails.
 */
export const decryptFile = (
    encryptedMessage,
    senderPublicKey,
    recipientPrivateKey,
) => {
    if (!encryptedMessage.startsWith("{")) {
        const fileBuffer = Buffer.from(encryptedMessage, "hex")
        const blob = new Blob([fileBuffer], {
            type: "application/octet-stream",
        })
        return URL.createObjectURL(blob)
    }

    try {
        const encryptedObj = JSON.parse(encryptedMessage)
        const { nonce, encrypted } = encryptedObj
        const sharedSecret = getSharedSecret(
            senderPublicKey,
            recipientPrivateKey,
        )

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret,
        )

        if (decrypted) {
            const decryptedBuffer = Buffer.from(decrypted)
            const blob = new Blob([decryptedBuffer], {
                type: "application/octet-stream",
            })
            const url = URL.createObjectURL(blob)
            return url
        } else {
            console.error(
                "Decryption failed. Check keys, nonce, and encrypted values.",
            )
            return null
        }
    } catch (error) {
        console.error("Decryption process error:", error)
        return null
    }
}
