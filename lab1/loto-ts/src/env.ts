import "dotenv/config";

const required = [
    "PORT",

    "M2M_AUDIENCE",
    "M2M_ISSUER",
    "M2M_REQUIRED_SCOPE",

    "AUTH0_ISSUER_BASE_URL",
    "AUTH0_BASE_URL",
    "AUTH0_CLIENT_ID",
    "AUTH0_CLIENT_SECRET",
    "AUTH0_SECRET",
    ];

for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
}

export const env = process.env as Record<string, string>