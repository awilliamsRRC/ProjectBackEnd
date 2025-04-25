import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.SECRET_KEY!, "hex");
const ivLength = 16;

export const encryptData = (data: string): string => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};

export const decryptData = (encryptedData: string): string => {
    if (!encryptedData || !encryptedData.includes(":")) {
        console.warn("⚠️ Skipping decryption: invalid format ->", encryptedData);
        return "Invalid or unencrypted data"; // fallback
    }

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
