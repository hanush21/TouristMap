import axios from "axios";


export const backend = axios.create({
    baseURL: process.env.BACKEND_API_BASE_URL,
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
});


export function parseAxiosError(err: unknown) {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status ?? 500;
        const data = err.response?.data ?? { error: err.message };
        return { status, data } as const;
    }
    return { status: 500, data: { error: "Unknown server error" } } as const;
}