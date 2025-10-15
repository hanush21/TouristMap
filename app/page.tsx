"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Background map/aerial photo (public Unsplash) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1920&auto=format&fit=crop"
          alt="Aerial map texture"
          fill
          priority
          className="object-cover opacity-40 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background" />
      </div>

      <main className="grid min-h-dvh place-content-center px-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="mb-4 text-xs tracking-[0.3em] text-emerald-700/80 dark:text-emerald-400/80">
            VISUALIZA LA CIUDAD
          </p>

          <h1 className="text-5xl md:text-7xl font-light leading-tight tracking-tight">
            Mapa Turístico
          </h1>

          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            Explora la actividad por barrios, descubre rutas esenciales y puntos de interés en una
            vista clara y elegante. Un mapa para comprender el pulso urbano en segundos.
          </p>

          <div className="mt-10 flex items-center justify-center">
            <Button asChild size="lg" className="px-7 py-6 rounded-xl text-base font-medium">
              <Link href="/mapa">Ver población y actividad</Link>
            </Button>
          </div>
        </motion.section>
      </main>

      <footer className="absolute inset-x-0 bottom-5">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Mapa Turístico</span>
          <span className="hidden sm:inline">Aplicación independiente</span>
        </div>
      </footer>
    </div>
  );
}
