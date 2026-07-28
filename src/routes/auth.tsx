import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Sign In — Crunzify" }, { name: "description", content: "Sign in or create an Crunzify account to order." }],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  name: z.string().trim().min(1, "Name required").max(80).optional(),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, name: mode === "signup" ? name : undefined });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

 async function googleSignIn() {
  setGoogleLoading(true);

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;

  } catch (err: any) {
    toast.error(err?.message ?? "Google sign-in failed");
  } finally {
    setGoogleLoading(false);
  }
}

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-md px-6">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to place an order." : "Sign up to start ordering."}
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/40"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={72}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm outline-none focus:border-foreground/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                disabled={loading}
                className="w-full rounded-full bg-foreground text-background py-3 text-sm font-medium disabled:opacity-60"
              >
                {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <button
              type="button"
              onClick={googleSignIn}
              disabled={googleLoading}
              className="mt-4 w-full inline-flex items-center justify-center gap-3 rounded-full border border-border bg-background py-3 text-sm font-medium hover:bg-muted/40 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 34.9 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C40.9 35.5 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
            <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}