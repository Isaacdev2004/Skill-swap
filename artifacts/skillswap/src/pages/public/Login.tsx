import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { useAuthStore } from "@/store/authStore";
import { api, ApiError } from "@/lib/api";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await api.auth.login({ email: email.trim(), password });
      setUser(user);
      setLocation("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3), transparent 60%)" }} />
        <div className="relative z-10 max-w-lg">
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center gap-2 bg-white/10 w-max px-4 py-2 rounded-full backdrop-blur-sm">
              <img src={logoPath} alt="SkillSwap" className="h-6 w-6 brightness-0 invert" />
              <span className="font-bold tracking-tight text-white">SkillSwap</span>
            </div>
          </Link>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">Welcome back to the community.</h1>
          <p className="text-xl text-primary-foreground/80">Log in to manage your sessions, message your swap partners, and discover new skills.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-background">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>

          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoPath} alt="SkillSwap" className="h-8 w-8" />
              <span className="font-bold text-xl">SkillSwap</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Log in</h2>
            <p className="text-muted-foreground">Enter your email to access your account.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPw ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-2" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
            </div>
            <Button variant="outline" type="button" className="w-full h-11 mt-6 gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>

          <div className="mt-6 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <strong>Demo accounts</strong><br />
            Admin: <code>admin@skillswap.app</code> / <code>Admin123!@#</code><br />
            User: <code>alex.smith0@skillswap.test</code> / <code>Password123!</code>
          </div>
        </div>
      </div>
    </div>
  );
}
