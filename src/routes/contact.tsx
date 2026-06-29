import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Send, Check } from "lucide-react";
import { GradientBadge } from "@/components/ui/GradientBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DIMISI.tech" },
      { name: "description", content: "Let's build something remarkable together." },
      { property: "og:title", content: "Contact — DIMISI.tech" },
      { property: "og:description", content: "Book a consultation with the DIMISI engineering team." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  company: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(20, "Tell us a little more (at least 20 chars)"),
});

type FormVals = z.infer<typeof schema>;

function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormVals>({ resolver: zodResolver(schema) });

  const onSubmit = async (_vals: FormVals) => {
    await new Promise((r) => setTimeout(r, 900)); // mock
    setSent(true);
  };

  return (
    <div className="px-4 lg:px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12">
        <div>
          <GradientBadge className="mb-6">Contact</GradientBadge>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Let's build something <span className="text-gradient">remarkable.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Tell us about your project. We respond within one business day.
          </p>

          <div className="mt-12 space-y-4">
            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-gradient-to-br from-[#3B82F6]/30 to-[#7C3AED]/30 border border-white/10 flex items-center justify-center">
                <Mail className="size-4" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="font-medium">hello@dimisi.tech</div>
              </div>
            </GlassCard>
            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-gradient-to-br from-[#06B6D4]/30 to-[#3B82F6]/30 border border-white/10 flex items-center justify-center">
                <MapPin className="size-4" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Studios</div>
                <div className="font-medium">Mumbai · Bengaluru · Remote</div>
              </div>
            </GlassCard>
          </div>
        </div>

        <GlassCard hover={false} className="p-8 lg:p-10">
          {sent ? (
            <div className="text-center py-16">
              <div className="mx-auto size-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center mb-6">
                <Check className="size-7" />
              </div>
              <h3 className="text-2xl font-semibold">Signal received.</h3>
              <p className="mt-2 text-muted-foreground">
                We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Field label="Your name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  className="contact-input"
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  className="contact-input"
                  placeholder="jane@company.com"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company">
                  <input {...register("company")} className="contact-input" placeholder="Acme Inc" />
                </Field>
                <Field label="Budget">
                  <select {...register("budget")} className="contact-input">
                    <option value="">Select range</option>
                    <option>{"<$50k"}</option>
                    <option>$50k–$150k</option>
                    <option>$150k–$500k</option>
                    <option>$500k+</option>
                  </select>
                </Field>
              </div>
              <Field label="Tell us about your project" error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="contact-input resize-none"
                  placeholder="What are you building? What does success look like?"
                />
              </Field>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#06B6D4] px-6 py-4 text-sm font-medium shadow-[0_10px_40px_-10px_rgba(124,58,237,0.6)] disabled:opacity-60"
              >
                {isSubmitting ? "Transmitting…" : (<>Send message <Send className="size-4" /></>)}
              </button>
            </form>
          )}
        </GlassCard>
      </div>

      <style>{`
        .contact-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 14px;
          color: #F1F5F9;
          font-size: 14px;
          transition: all .25s ease;
        }
        .contact-input:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
        .contact-input::placeholder { color: #64748B; }
        select.contact-input { appearance: none; }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
