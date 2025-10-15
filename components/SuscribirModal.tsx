'use client';

import * as React from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ================= Interfaces finales =================
export interface Newsletter {
  email: string;
}

export interface SuscribirModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ruta del proxy interno en Next (por defecto /api/newsletter) */
  submitUrl?: string;
}

// ================= Schema Zod =================
const NewsletterSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type NewsletterValues = z.infer<typeof NewsletterSchema>;

// ================= Componente =================
const SuscribirModal: React.FC<SuscribirModalProps> = ({ isOpen, onClose, submitUrl = '/api/newsletter' }) => {
  const form = useForm<NewsletterValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (values: NewsletterValues) => {
    try {
      setIsSubmitting(true);
      await axios.post(submitUrl, values); // envía a tu route handler → backend
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Newsletter error:', err.response?.status, err.response?.data);
        alert(
          (err.response?.data as any)?.error ||
            (err.response?.data as any)?.details?.error ||
            'No se pudo completar la suscripción'
        );
      } else {
        alert('Error desconocido');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    form.reset({ email: '' });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className="sm:max-w-md">
        {isSubmitted ? (
          <div className="space-y-6 text-center py-4">
            <div className="text-emerald-600 text-5xl leading-none">✓</div>
            <div>
              <DialogTitle className="text-2xl font-semibold">¡Suscripción exitosa!</DialogTitle>
              <DialogDescription>
                Te enviaremos novedades puntuales a tu correo.
              </DialogDescription>
            </div>
            <DialogFooter className="flex gap-2 justify-center">
              <Button variant="outline" onClick={resetAndClose}>Cerrar</Button>
              <Button onClick={() => { setIsSubmitted(false); form.reset({ email: '' }); }}>Nueva suscripción</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Suscribirse a la newsletter</DialogTitle>
              <DialogDescription>
                Deja tu email para recibir notificaciones y novedades.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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

                <DialogFooter className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                  <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                    {isSubmitting ? 'Enviando…' : 'Suscribirme'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuscribirModal;
