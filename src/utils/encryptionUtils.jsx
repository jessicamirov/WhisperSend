import nacl from "tweetnacl"
import elliptic from "elliptic"
import { Buffer } from "buffer"

const ec = new elliptic.ec("secp256k1")

const getSharedSecret = (publicKeyHex, privateKeyHex) => {
    const senderEcKey = ec.keyFromPrivate(privateKeyHex.slice(2), "hex")
    const recipientEcKey = ec.keyFromPublic(publicKeyHex.slice(2), "hex")
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
    if (!encryptedMessage || !senderPublicKey || !recipientPrivateKey) {
        console.error("Invalid arguments for decryptText:", {
            encryptedMessage,
            senderPublicKey,
            recipientPrivateKey,
        })
        return "error"
    }

    let encryptedObj
    try {
        encryptedObj = JSON.parse(encryptedMessage)
    } catch (error) {
        console.error("Failed to parse encryptedMessage:", error)
        return "error"
    }

    const { nonce, encrypted } = encryptedObj

    if (!nonce || !encrypted) {
        console.error("Invalid encrypted object:", encryptedObj)
        return "error"
    }

    const sharedSecret = getSharedSecret(senderPublicKey, recipientPrivateKey)

    const decrypted = nacl.box.open.after(
        Uint8Array.from(Buffer.from(encrypted, "hex")),
        Uint8Array.from(Buffer.from(nonce, "hex")),
        sharedSecret,
    )

    return decrypted ? Buffer.from(decrypted).toString() : "error"
}

export const encryptFile = (
    fileBuffer,
    recipientPublicKey,
    senderPrivateKey,
) => {
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey)
    const nonce = nacl.randomBytes(24)
    const encrypted = nacl.box.after(fileBuffer, nonce, sharedSecret)

    return JSON.stringify({
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
    })
}

export const decryptFile = (
    encryptedMessage,
    senderPublicKey,
    recipientPrivateKey,
) => {
    if (!encryptedMessage.startsWith("{")) {
        const fileBuffer = Buffer.from(encryptedMessage, "hex")
        return URL.createObjectURL(
            new Blob([fileBuffer], { type: "application/octet-stream" }),
        )
    }

    const encryptedObj = JSON.parse(encryptedMessage)
    const { nonce, encrypted } = encryptedObj

    if (!nonce || !encrypted) {
        console.error("Invalid nonce or encrypted data:", encryptedObj)
        return null
    }

    const sharedSecret = getSharedSecret(senderPublicKey, recipientPrivateKey)

    const decrypted = nacl.box.open.after(
        Uint8Array.from(Buffer.from(encrypted, "hex")),
        Uint8Array.from(Buffer.from(nonce, "hex")),
        sharedSecret,
    )

    return decrypted
        ? URL.createObjectURL(
              new Blob([Buffer.from(decrypted)], {
                  type: "application/octet-stream",
              }),
          )
        : null
}
