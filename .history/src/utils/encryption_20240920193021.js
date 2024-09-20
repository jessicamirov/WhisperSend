import nacl from "tweetnacl"
import { Buffer } from "buffer"
import elliptic from "elliptic"
const ec = elliptic.ec
import { ethers } from "ethers"

// Destructure `utils` from ethers
const { utils } = ethers


/**
 * Decompresses a public key using ethers.js
 */
const decompressPublicKey = (compressedPublicKey) => {
    // Use ethers.utils to compute an uncompressed public key
    return utils.computePublicKey(compressedPublicKey, false) // false for uncompressed key
}
/**
 * Generates a shared secret using the sender's private key and recipient's public key.
 */
export const getSharedSecret = (publicKeyHex, privateKeyHex) => {
    if (!publicKeyHex || !privateKeyHex) {
        throw new Error(
            "Missing public or private key for shared secret generation.",
        )
    }

    const secp256k1 = new ec("secp256k1")
    // Decompress the public key if it's compressed
    if (publicKeyHex.startsWith("02") || publicKeyHex.startsWith("03")) {
        publicKeyHex = decompressPublicKey(publicKeyHex) 
    }

    const senderEcKey = secp256k1.keyFromPrivate(privateKeyHex.slice(2), "hex")
    const recipientEcKey = secp256k1.keyFromPublic(publicKeyHex.slice(2), "hex")

    if (!senderEcKey || !recipientEcKey) {
        throw new Error("Invalid keys for shared secret generation.")
    }

    const sharedSecret = senderEcKey.derive(recipientEcKey.getPublic())
    return Buffer.from(sharedSecret.toArray("be", 32))
}
/**
 * Encrypts a text message using the recipient's public key and sender's private key.
 * 
 * Process:
 * 1. Derive a shared secret using Elliptic Curve Diffie-Hellman (ECDH).
 * 2. Generate a nonce to ensure encryption uniqueness.
 * 3. Encrypt the text using NaCl's `box.after` function with the shared secret and nonce.
 * 4. Return the encrypted message and nonce in hex format.
 */
export const encryptText = (text, recipientPublicKey, senderPrivateKey) => {
    if (!text || !recipientPublicKey || !senderPrivateKey) {
        console.error(
            "Missing parameters for encryption. Text, recipientPublicKey, or senderPrivateKey is missing.",
        )
        return null
    }

    try {
        const sharedSecret = getSharedSecret(
            recipientPublicKey,
            senderPrivateKey,
        )
        const nonce = nacl.randomBytes(24)
        const encrypted = nacl.box.after(Buffer.from(text), nonce, sharedSecret)

        return {
            nonce: Buffer.from(nonce).toString("hex"),
            encrypted: Buffer.from(encrypted).toString("hex"),
        }
    } catch (error) {
        console.error("Error during encryption:", error)
        return null
    }
}
/**
 * Decrypts an encrypted text message using the shared secret.
 */
export const decryptText = (
    encryptedMessage,
    senderPublicKey,
    recipientPrivateKey,
) => {
    if (!senderPublicKey || !recipientPrivateKey) {
        console.error("Missing keys for decryption.")
        return "error"
    }

    if (!encryptedMessage || typeof encryptedMessage !== "string") {
        console.error("Invalid encrypted message.")
        return "error"
    }

    try {
        if (!encryptedMessage.startsWith("{")) {
            return Buffer.from(encryptedMessage, "hex").toString()
        }

        const encryptedObj = JSON.parse(encryptedMessage)
        const sharedSecret = getSharedSecret(
            senderPublicKey,
            recipientPrivateKey,
        )
        const { nonce, encrypted } = encryptedObj

        if (!nonce || !encrypted) {
            console.error("Invalid nonce or encrypted data.")
            return "error"
        }

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret,
        )

        if (decrypted) {
            console.log("Decrypted Text:", Buffer.from(decrypted).toString())
            return Buffer.from(decrypted).toString()
        } else {
            console.error("Decryption failed.")
            return "error"
        }
    } catch (error) {
        console.error("Decryption error:", error)
        return "error"
    }
}

export const encryptFile = (file, recipientPublicKey, senderPrivateKey) => {
    console.log("orint in encryptFile ")
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey)

    const fileBuffer = Buffer.from(file)
    const nonce = nacl.randomBytes(24)
    const encrypted = nacl.box.after(fileBuffer, nonce, sharedSecret)

    console.log("Nonce:", Buffer.from(nonce).toString("hex"))
    console.log("Encrypted File Data:", Buffer.from(encrypted).toString("hex"))

    return {
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
        type: file.type,
    }
}

export const decryptFile = (
    encryptedMessage,
    senderPublicKey,
    recipientPrivateKey,
) => {
    try {
        const encryptedObj = JSON.parse(encryptedMessage);
        const { nonce, encrypted, type } = encryptedObj;


        const sharedSecret = getSharedSecret(
            senderPublicKey,
            recipientPrivateKey,
        );

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret,
        );

        if (decrypted) {
           
            return new Blob([Buffer.from(decrypted)], {
                type: type || "application/octet-stream", 
            });
        } else {
            console.error(
                "Decryption failed. Check keys, nonce, and encrypted values."
            );
            return null;
        }
    } catch (error) {
        console.error("Decryption process error:", error);
        return null;
    }
};
