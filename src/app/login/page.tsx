"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Left panel 4/12 — background image */}
      <div className="hidden lg:block col-span-4 relative">
        <Image
          src="/login-img.jpg"
          alt="La Vita Buona"
          fill
          className="object-cover"
          priority
          sizes="33vw"
          quality={80}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Branding */}
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-white/60">
              Ristorante
            </p>
            <h1 className="text-3xl font-bold mt-1">La Vita Buona</h1>
          </div>
          <blockquote className="text-white/60 text-sm leading-relaxed">
            "La cucina è arte, il servizio è rispetto."
          </blockquote>
        </div>
      </div>

      {/* Right panel 8/12 — form */}
      <div className="col-span-12 lg:col-span-8 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Ristorante
            </p>
            <h1 className="text-3xl font-bold mt-1">La Vita Buona</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Acceder</h2>
            <p className="text-sm text-muted-foreground">Panel de gestión del menú</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@restaurante.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
