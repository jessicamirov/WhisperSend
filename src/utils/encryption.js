import nacl from "tweetnacl";
import { Buffer } from "buffer";
import elliptic from "elliptic";
const ec = elliptic.ec;
import { ethers } from "ethers"; // Import ethers

// Destructure `utils` from ethers
const { utils } = ethers;

// Function to decompress the public key using ethers.js
const decompressPublicKey = (compressedPublicKey) => {
    // Use ethers.utils to compute an uncompressed public key
    return utils.computePublicKey(compressedPublicKey, false); // false for uncompressed key
};

export const getSharedSecret = (publicKeyHex, privateKeyHex) => {
    if (!publicKeyHex || !privateKeyHex) {
        throw new Error("Missing public or private key for shared secret generation.");
    }

    const secp256k1 = new ec("secp256k1");

    // Decompress compressed public key if it starts with '02' or '03'
    if (publicKeyHex.startsWith("02") || publicKeyHex.startsWith("03")) {
        publicKeyHex = decompressPublicKey(publicKeyHex); // decompress if needed
    }

    const senderEcKey = secp256k1.keyFromPrivate(privateKeyHex.slice(2), "hex");
    const recipientEcKey = secp256k1.keyFromPublic(publicKeyHex.slice(2), "hex");

    if (!senderEcKey || !recipientEcKey) {
        throw new Error("Invalid keys for shared secret generation.");
    }

    // Derive shared secret
    const sharedSecret = senderEcKey.derive(recipientEcKey.getPublic());
    console.log("Shared Secret:", Buffer.from(sharedSecret.toArray("be", 32)).toString("hex"));

    return Buffer.from(sharedSecret.toArray("be", 32));
};

// Encrypt Text
export const encryptText = (text, recipientPublicKey, senderPrivateKey) => {
    if (!text || !recipientPublicKey || !senderPrivateKey) {
        console.error(
            "Missing parameters for encryption. Text, recipientPublicKey, or senderPrivateKey is missing."
        );
        return null;
    }

    try {
        const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey);
        const nonce = nacl.randomBytes(24);
        const encrypted = nacl.box.after(Buffer.from(text), nonce, sharedSecret);

        return {
            nonce: Buffer.from(nonce).toString("hex"),
            encrypted: Buffer.from(encrypted).toString("hex"),
        };
    } catch (error) {
        console.error("Error during encryption:", error);
        return null;
    }
};

// Decrypt Text
export const decryptText = (encryptedMessage, senderPublicKey, recipientPrivateKey) => {
    if (!senderPublicKey || !recipientPrivateKey) {
        console.error("Missing keys for decryption.");
        return "error";
    }

    if (!encryptedMessage || typeof encryptedMessage !== "string") {
        console.error("Invalid encrypted message.");
        return "error";
    }

    try {
        if (!encryptedMessage.startsWith("{")) {
            return Buffer.from(encryptedMessage, "hex").toString();
        }

        const encryptedObj = JSON.parse(encryptedMessage);
        const sharedSecret = getSharedSecret(senderPublicKey, recipientPrivateKey);
        const { nonce, encrypted } = encryptedObj;

        if (!nonce || !encrypted) {
            console.error("Invalid nonce or encrypted data.");
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
            console.error("Decryption failed.");
            return "error";
        }
    } catch (error) {
        console.error("Decryption error:", error);
        return "error";
    }
};

// Encrypt File
export const encryptFile = (file, recipientPublicKey, senderPrivateKey) => {
    console.log("orint in encryptFile ");
    const sharedSecret = getSharedSecret(recipientPublicKey, senderPrivateKey);
 


    const fileBuffer = Buffer.from(file);
    const nonce = nacl.randomBytes(24);
    const encrypted = nacl.box.after(fileBuffer, nonce, sharedSecret);

    console.log("Nonce:", Buffer.from(nonce).toString("hex"));
    console.log("Encrypted File Data:", Buffer.from(encrypted).toString("hex"));

    return {
        nonce: Buffer.from(nonce).toString("hex"),
        encrypted: Buffer.from(encrypted).toString("hex"),
        type: file.type,
    };
};

// Decrypt File
export const decryptFile = (encryptedMessage, senderPublicKey, recipientPrivateKey) => {
    try {
        console.log("Starting decryption process...");
        console.log("Sender's Public Key:", senderPublicKey);
        console.log("Recipient's Private Key:", recipientPrivateKey);

        // Generate shared secret
        console.log("orint in decryptFile ");
        const sharedSecret = getSharedSecret(senderPublicKey, recipientPrivateKey);
    


        if (!sharedSecret) {
            throw new Error("Failed to generate shared secret.");
        }

        // Try to parse encrypted message
        let encryptedObj;
        try {
            encryptedObj = JSON.parse(encryptedMessage); // assume valid JSON input
        } catch (parseError) {
            console.error("Failed to parse encrypted message as JSON. Assuming raw hex.");
            encryptedObj = { encrypted: encryptedMessage }; // handle raw hex input
        }

        const { nonce, encrypted } = encryptedObj;

        if (!nonce || !encrypted) {
            console.error("Invalid nonce or encrypted data.");
            return null;
        }

        console.log("Nonce (hex):", nonce);
        console.log("Encrypted data (hex):", encrypted);

        // Decrypt the message
        const decrypted = nacl.box.open.after(
            Uint8Array.from(Buffer.from(encrypted, "hex")),
            Uint8Array.from(Buffer.from(nonce, "hex")),
            sharedSecret
        );

        if (decrypted) {
            const decryptedText = Buffer.from(decrypted).toString('utf-8');
            console.log("Decrypted content (raw text):", decryptedText);

            // Try to parse decrypted content as JSON
            try {
                const jsonObject = JSON.parse(decryptedText);
                console.log("Parsed JSON Object:", jsonObject);
                return jsonObject;
            } catch (jsonError) {
                console.log("Decrypted content is not JSON, returning raw text.");
                return decryptedText; // return as plain text if not JSON
            }
        } else {
            console.error("Decryption failed. Check keys, nonce, and encrypted values.");
            return null;
        }
    } catch (error) {
        console.error("Decryption process error:", error);
        return null;
    }
};
