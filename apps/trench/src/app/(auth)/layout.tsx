import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Trench",
  description: "Sign in to your Trench account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
