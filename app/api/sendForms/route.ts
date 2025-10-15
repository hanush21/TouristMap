import { NextResponse } from "next/server";
import { z } from "zod";
import { backend, parseAxiosError } from "@/lib/server/api";


const rating = z.number().int().min(1).max(5);


const BodySchema = z.object({
    cleaning: rating,
    noise: rating,
    lighting: rating,
    security: rating,
    peopleCuantity: rating,
    accessibility: rating,
    comercialActivity: rating,
    resident: z.boolean(),
    neiborhood: z.string().optional().or(z.literal("")),
});


export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = BodySchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid body", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }


        // Optional: map to backend field names if different
        const payload = parsed.data;


        const res = await backend.post("/formularios", payload);
        return NextResponse.json(res.data, { status: res.status });
    } catch (err) {
        const { status, data } = parseAxiosError(err);
        return NextResponse.json(data, { status });
    }
}


export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}