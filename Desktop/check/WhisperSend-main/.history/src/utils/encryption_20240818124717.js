import nacl from "tweetnacl"
import { Buffer } from "buffer"
import elliptic from "elliptic"
const ec = elliptic.ec

const getSharedSecret = (publicKeyHex, privateKeyHex) => {
    const secp256k1 = new ec("secp256k1")
    const senderEcKey = secp256k1.keyFromPrivate(privateKeyHex.slice(2), "hex")
    const recipientEcKey = secp256k1.keyFromPublic(publicKeyHex.slice(2), "hex")
    const sharedSecret = senderEcKey.derive(recipientEcKey.getPublic())
    return Buffer.from(sharedSecret.toArray("be", 32))
}

export const encryptText = (text, recipientPublicKey, senderPrivateKey) => {
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey)
    const nonce = nacl.randomBytes(24)
    const encrypted = nacl.box.after(Buffer.from(text), nonce, sharedSecret)

    return {
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
    }
}

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

        console.log("nonce:", nonce) // Log the nonce
        console.log("encrypted:", encrypted) // Log the encrypted data

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret,
        )

        if (decrypted) {
            const decryptedMessage = Buffer.from(decrypted).toString()
            console.log("Decrypted message:", decryptedMessage) // Log the decrypted message
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

        console.log("nonce:", nonce) // Log the nonce
        console.log("encrypted:", encrypted) // Log the encrypted data

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
