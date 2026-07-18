import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-muted/30">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border p-8">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img src={logoPath} alt="SkillSwap" className="h-12 w-12" />
          </Link>
        </div>

        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
              <p className="text-muted-foreground text-sm">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email address</label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <Button type="submit" className="w-full h-11">
                Send reset link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground text-sm mb-8">
              We've sent a password reset link to your email. Click the link to choose a new password.
            </p>
            <Button variant="outline" className="w-full h-11" onClick={() => setSubmitted(false)}>
              Didn't receive it? Try again
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
