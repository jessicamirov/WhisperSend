import nacl from "tweetnacl";
import { Buffer } from "buffer";
import elliptic from "elliptic";
const ec = elliptic.ec;

const getSharedSecret = (publicKeyHex, privateKeyHex) => {
    const secp256k1 = new ec("secp256k1");
    const senderEcKey = secp256k1.keyFromPrivate(privateKeyHex.slice(2), "hex");
    const recipientEcKey = secp256k1.keyFromPublic(publicKeyHex.slice(2), "hex");
    const sharedSecret = senderEcKey.derive(recipientEcKey.getPublic());
    console.log("Shared Secret:", Buffer.from(sharedSecret.toArray("be", 32)).toString("hex"));
    return Buffer.from(sharedSecret.toArray("be", 32));
};

export const encryptText = (text, recipientPublicKey, senderPrivateKey) => {
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey);
    const nonce = nacl.randomBytes(24);
    const encrypted = nacl.box.after(Buffer.from(text), nonce, sharedSecret);

    console.log("Nonce:", Buffer.from(nonce).toString("hex"));
    console.log("Encrypted Text:", Buffer.from(encrypted).toString("hex"));

    return {
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
    };
};

export const decryptText = (
    encryptedMessage,
    senderPublicKey,
    recipientPrivateKey
) => {
    if (!encryptedMessage || typeof encryptedMessage !== "string") {
        console.error("Invalid encrypted message:", encryptedMessage);
        return "error";
    }

    if (!encryptedMessage.startsWith("{")) {
        return Buffer.from(encryptedMessage, "hex").toString();
    }

    const encryptedObj = JSON.parse(encryptedMessage);
    try {
        const sharedSecret = getSharedSecret(
            senderPublicKey,
            recipientPrivateKey
        );
        const { nonce, encrypted } = encryptedObj;

        if (!nonce || !encrypted) {
            console.error("Invalid nonce or encrypted data:", nonce, encrypted);
            return "error";
        }

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret
        );

        if (decrypted) {
            console.log("Decrypted Text:", Buffer.from(decrypted).toString());
            return Buffer.from(decrypted).toString();
        } else {
            console.error(
                "Decryption failed. Check keys, nonce, and encrypted values."
            );
            return "error";
        }
    } catch (error) {
        console.error("Decryption process error:", error);
        return "error";
    }
};

export const encryptFile = (
    file,
    recipientPublicKey,
    senderPrivateKey
) => {
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey);

    const fileBuffer = Buffer.from(file);
    const nonce = nacl.randomBytes(24);
    const encrypted = nacl.box.after(fileBuffer, nonce, sharedSecret);

    console.log("Nonce:", Buffer.from(nonce).toString("hex"));
    console.log("Encrypted File Data:", Buffer.from(encrypted).toString("hex"));

    return {
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
        type: file.type // Retaining the file type
    };
};

export const decryptFile = (
    encryptedMessage,
    senderPublicKey,
    recipientPrivateKey
) => {
    if (!encryptedMessage.startsWith("{")) {
        const fileBuffer = Buffer.from(encryptedMessage, "hex");
        return new Blob([fileBuffer], { type: "application/octet-stream" });
    }

    try {
        const encryptedObj = JSON.parse(encryptedMessage);
        const { nonce, encrypted, type } = encryptedObj;
        const sharedSecret = getSharedSecret(
            senderPublicKey,
            recipientPrivateKey
        );

        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret
        );

        if (decrypted) {
            console.log("Decrypted File Data:", Buffer.from(decrypted).toString("hex"));
            return new Blob([Buffer.from(decrypted)], { type: type || "application/octet-stream" });
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
