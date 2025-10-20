import "dotenv/config";

const required = ["M2M_AUDIENCE", "M2M_ISSUER", "M2M_REQUIRED_SCOPE"];

for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
}

export const env = process.env as Record<string, string>