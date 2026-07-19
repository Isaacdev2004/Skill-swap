import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { useAuthStore } from "@/store/authStore";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { setUser } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const { user } = await api.auth.register({ name: name.trim(), email: email.trim(), password });
      setUser(user);
      setLocation("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel — brand */}
      <div className="hidden lg:flex w-[420px] flex-col justify-between px-12 py-12 bg-[#1e1b4b] text-white relative overflow-hidden flex-shrink-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
        <Link href="/" className="relative z-10 flex items-center gap-2 w-max">
          <img src={logoPath} alt="SkillSwap" className="h-8 w-8 brightness-0 invert" />
          <span className="font-bold text-lg tracking-tight">SkillSwap</span>
        </Link>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-tight">Learn anything.<br />Teach anything.</h2>
          <p className="text-white/70 text-base leading-relaxed">Exchange skills, build connections. Grow together.</p>
          {[{ initials: "SJ", color: "bg-purple-500", teaches: "Guitar", wants: "Python" }, { initials: "AS", color: "bg-indigo-500", teaches: "Python", wants: "Guitar" }].map((c, i) => (
            <div key={i} className={cn("bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10", i === 1 && "ml-6")}>
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm", c.color)}>{c.initials}</div>
                <div className="text-sm">
                  <div className="text-white/60">Teaches <span className="text-white font-medium">{c.teaches}</span></div>
                  <div className="text-white/60">Wants <span className="text-emerald-400 font-medium">{c.wants}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="relative z-10 text-xs text-white/40">© 2024 SkillSwap. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 bg-background">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoPath} alt="SkillSwap" className="h-7 w-7" />
              <span className="font-bold text-lg">SkillSwap</span>
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Welcome to SkillSwap</h1>
            <p className="text-muted-foreground text-sm">Create your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>
          )}

          <Button variant="outline" type="button" className="w-full h-11 mb-5 gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </Button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">Or sign up with Email</span></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="name">Full Name</label>
              <Input id="name" placeholder="John Doe" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">Email Address</label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <div className="relative">
                <Input id="password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              By signing up you agree to our <a href="/terms" className="underline hover:text-foreground">Terms</a> and <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
            <Button type="submit" className="w-full h-11 text-base mt-2" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
