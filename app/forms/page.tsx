// app/mapa/valorar/page.tsx
import TouristForm, { DEFAULT_NEIGHBORHOODS } from "@/components/forms/forms";

export default function Page({ searchParams }: { searchParams: { barrios?: string } }) {
    // Puedes pasar barrios por params: ?barrios=Centro,Eixample,Gràcia
    const neighborhoods = searchParams?.barrios
        ? searchParams.barrios.split(",").map((s) => s.trim()).filter(Boolean)
        : DEFAULT_NEIGHBORHOODS;

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <h1 className="text-2xl font-semibold mb-6">Valora tu zona</h1>
            <TouristForm
                submitUrl="/api/sendForms"
                newsletterUrl="/api/newsletter"
                neighborhoods={neighborhoods}
            />
        </div>
    );
}
