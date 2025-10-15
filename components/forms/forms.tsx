"use client";

import * as React from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// ---------------- Interfaces (del usuario) ----------------
export interface FormProps {
    cleaning: number;
    noise: number;
    lighting: number;
    resident: boolean;
    neiborhood?: string;
    comercialActivity: number; // cambiado a 1..5
    security: number;
    peopleCuantity: number;
    accessibility: number;
}

export interface Newsletter {
    email: string;
}

// ---------------- Zod Schemas ----------------
const rating = z.number().int().min(1, "Selecciona 1–5").max(5, "Selecciona 1–5");

const FormSchema = z.object({
    cleaning: rating,
    noise: rating,
    lighting: rating,
    security: rating,
    peopleCuantity: rating,
    accessibility: rating,
    comercialActivity: rating, // ahora 1..5
    resident: z.boolean(),
    neiborhood: z.string().trim().max(80).optional().or(z.literal("")),
});
export type TouristFormValues = z.infer<typeof FormSchema>;

const NewsletterSchema = z.object({ email: z.string().email("Email inválido") });
export type NewsletterValues = z.infer<typeof NewsletterSchema>;

// ---------------- Datos de barrios placeholder ----------------
export const DEFAULT_NEIGHBORHOODS: string[] = [
    "Centro",
    "Casco Antiguo",
    "Raval",
    "Eixample",
    "Gòtic",
    "La Latina",
    "Malasaña",
    "Chueca",
    "Lavapiés",
    "Gràcia",
];

// ---------------- Props del componente ----------------
interface TouristFormProps {
    /** endpoint para POST del formulario principal */
    submitUrl: string;
    /** endpoint para POST del newsletter */
    newsletterUrl: string;
    /** lista de barrios, si no se pasa usa DEFAULT_NEIGHBORHOODS */
    neighborhoods?: string[];
    /** valores por defecto opcionales */
    defaultValues?: Partial<TouristFormValues>;
}

export default function TouristForm({
    submitUrl,
    newsletterUrl,
    neighborhoods,
    defaultValues,
}: TouristFormProps) {
    const NLIST = neighborhoods?.length ? neighborhoods : DEFAULT_NEIGHBORHOODS;

    const form = useForm<TouristFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            cleaning: 3,
            noise: 3,
            lighting: 3,
            security: 3,
            peopleCuantity: 3,
            accessibility: 3,
            comercialActivity: 3,
            resident: false,
            neiborhood: "",
            ...defaultValues,
        },
        mode: "onChange",
    });

    const newsletterForm = useForm<NewsletterValues>({
        resolver: zodResolver(NewsletterSchema),
        defaultValues: { email: "" },
        mode: "onChange",
    });

    const [openNewsletter, setOpenNewsletter] = React.useState(false);
    const [submittedOnce, setSubmittedOnce] = React.useState(false);

    const handleSubmit = async (values: TouristFormValues) => {
        // zod ya garantiza campos completos según el schema
        await axios.post(submitUrl, values);
        setSubmittedOnce(true);
        setOpenNewsletter(true);
    };

    const handleSubscribe = async (values: NewsletterValues) => {
        await axios.post(newsletterUrl, values);
        setOpenNewsletter(false);
    };

    return (
        <>
            <Form {...form}>
                <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
                    {/* Ratings */}
                    <fieldset className="grid gap-4">
                        <legend className="text-sm font-medium text-muted-foreground">Valoración (1–5)</legend>
                        <RatingField control={form.control} name="cleaning" label="Limpieza" />
                        <RatingField control={form.control} name="noise" label="Ruido" />
                        <RatingField control={form.control} name="lighting" label="Iluminación" />
                        <RatingField control={form.control} name="security" label="Seguridad" />
                        <RatingField control={form.control} name="peopleCuantity" label="Cantidad de personas" />
                        <RatingField control={form.control} name="accessibility" label="Accesibilidad" />
                        <RatingField control={form.control} name="comercialActivity" label="Actividad comercial" />
                    </fieldset>

                    <Separator />

                    {/* Residente y barrio */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="resident"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿Eres residente?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            className="flex gap-4"
                                            value={String(field.value)}
                                            onValueChange={(v) => field.onChange(v === "true")}
                                        >
                                            <label className="inline-flex items-center gap-2">
                                                <RadioGroupItem value="true" id="resident-si" />
                                                <span className="text-sm">Sí</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2">
                                                <RadioGroupItem value="false" id="resident-no" />
                                                <span className="text-sm">No</span>
                                            </label>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="neiborhood"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Barrio (opcional)</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value || undefined}
                                            onValueChange={(v) => field.onChange(v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un barrio" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[3100]">{NLIST.map((b) => (
                                                <SelectItem key={b} value={b}>
                                                    {b}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="reset" variant="outline" onClick={() => form.reset()} disabled={form.formState.isSubmitting}>
                            Limpiar
                        </Button>
                        <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Enviando…" : "Enviar"}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Newsletter dialog */}
            <Dialog open={openNewsletter} onOpenChange={setOpenNewsletter}>
                <DialogContent className="z-[3200]">
                    <DialogHeader>
                        <DialogTitle>¿Quieres recibir novedades por email?</DialogTitle>
                    </DialogHeader>

                    <Form {...newsletterForm}>
                        <form className="grid gap-4" onSubmit={newsletterForm.handleSubmit(handleSubscribe)}>
                            <FormField
                                control={newsletterForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="tu@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button type="button" variant="ghost" onClick={() => setOpenNewsletter(false)}>
                                    No, gracias
                                </Button>
                                <Button type="submit" disabled={!newsletterForm.formState.isValid || newsletterForm.formState.isSubmitting}>
                                    {newsletterForm.formState.isSubmitting ? "Guardando…" : "Suscribirme"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {submittedOnce && !openNewsletter ? (
                <p className="mt-3 text-sm text-muted-foreground">¡Gracias por tu valoración!</p>
            ) : null}
        </>
    );
}

// ---------------- Helper rating 1..5 ----------------
import type { Control } from "react-hook-form";

type RatingFieldProps = {
    control: Control<TouristFormValues> | any;
    name: keyof Pick<
        FormProps,
        | "cleaning"
        | "noise"
        | "lighting"
        | "security"
        | "peopleCuantity"
        | "accessibility"
        | "comercialActivity"
    >;
    label: string;
};

function RatingField({ control, name, label }: RatingFieldProps) {
    return (
        <FormField
            control={control}
            name={name as any}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            className="flex gap-2"
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(Number(v))}
                        >
                            {[1, 2, 3, 4, 5].map((n) => (
                                <label key={n} className="inline-flex items-center">
                                    <RadioGroupItem value={String(n)} id={`${String(name)}-${n}`} className="mr-2" />
                                    <span className="text-sm">{n}</span>
                                </label>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
