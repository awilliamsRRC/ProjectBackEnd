import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = crypto.randomBytes(32); // Replace with a securely stored key in production
const ivLength = 16; // Length of the Initialization Vector

export const encryptData = (data: string): string => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};

export const decryptData = (encryptedData: string): string => {
    const [iv, encrypted] = encryptedData.split(":");
    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
