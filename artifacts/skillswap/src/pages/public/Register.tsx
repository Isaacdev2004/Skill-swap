import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useAuthStore();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "arjun@example.com");
    setLocation("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel - form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-background">
        <div className="lg:hidden mb-12">
          <Link href="/" className="flex items-center gap-2">
            <img src={logoPath} alt="SkillSwap" className="h-8 w-8" />
            <span className="font-bold text-xl">SkillSwap</span>
          </Link>
        </div>
        
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Create an account</h2>
            <p className="text-muted-foreground">Join the community and start swapping skills today.</p>
          </div>

          <Button variant="outline" type="button" className="w-full h-11 mb-6">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Full Name</label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <Input id="password" type="password" placeholder="Create a password" required />
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-6">
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right panel - illustration */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg ml-auto">
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center gap-2 bg-white/10 w-max px-4 py-2 rounded-full backdrop-blur-sm">
              <img src={logoPath} alt="SkillSwap" className="h-6 w-6 brightness-0 invert" />
              <span className="font-bold tracking-tight text-white">SkillSwap</span>
            </div>
          </Link>
          <h1 className="text-5xl font-bold tracking-tight mb-6">Learn anything. Teach anything.</h1>
          <p className="text-xl text-secondary-foreground/80 mb-8">
            SkillSwap matches you with peers who want to learn what you know, and can teach you what you want to learn. No money involved.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-white/90">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-secondary bg-blue-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-secondary bg-emerald-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-secondary bg-rose-500"></div>
            </div>
            <span>Join 12,000+ active members</span>
          </div>
        </div>
      </div>
    </div>
  );
}
