"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 pb-24 pt-24">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
