"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const update = <K extends keyof typeof form>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-10 bg-white p-8 text-center">
        <p className="text-lg font-medium">
          Thanks — we&rsquo;ve got your message.
        </p>
        <p className="mt-2 text-sm text-ink/50">
          We&rsquo;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
      <Field label="Name">
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your name"
          className="input"
          required
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@email.com"
          className="input"
          required
        />
      </Field>
      <Field label="Phone Number">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="04XX XXX XXX"
          className="input"
        />
      </Field>
      <Field label="Message">
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="How can we help?"
          rows={5}
          className="input"
          required
        />
      </Field>
      <button
        type="submit"
        className="bg-ink py-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-90"
      >
        Send
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
