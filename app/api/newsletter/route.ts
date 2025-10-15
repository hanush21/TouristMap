import { NextResponse } from "next/server";
import { z } from "zod";
import { backend, parseAxiosError } from "@/lib/server/api";


const NewsletterSchema = z.object({ email: z.string().email() });


export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = NewsletterSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid email", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }


        const res = await backend.post("/newsletter", parsed.data);
        return NextResponse.json(res.data, { status: res.status });
    } catch (err) {
        const { status, data } = parseAxiosError(err);
        return NextResponse.json(data, { status });
    }
}


export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

