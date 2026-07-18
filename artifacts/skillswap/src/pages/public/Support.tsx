import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown, ChevronUp, Mail, BookOpen, Flag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How does SkillSwap work?",
    a: "SkillSwap connects people who want to exchange skills. You create a profile listing what you can teach and what you want to learn. Our algorithm finds compatible matches. Once matched, you chat, schedule a session via Google Meet, and swap knowledge — no money involved.",
  },
  {
    q: "Is SkillSwap free to use?",
    a: "Yes, SkillSwap is completely free. The entire premise is that knowledge is the currency — you teach someone something, and they teach you something in return.",
  },
  {
    q: "How do I schedule a session?",
    a: "Once you've agreed on a swap with your partner, go to Sessions → Schedule Session. Pick a date and time, add notes about what you'd like to focus on, and confirm. Your partner will receive a notification and can accept or suggest a different time.",
  },
  {
    q: "How do sessions take place?",
    a: "Sessions are conducted over Google Meet. After scheduling, both parties will see a 'Join Meet' button in the Sessions page and Dashboard. SkillSwap does not host video calls directly.",
  },
  {
    q: "What if my swap partner doesn't show up?",
    a: "If a partner misses a session without notice, you can report it through the session details. Repeated no-shows may result in lower visibility or account suspension for that user. We recommend messaging your partner before each session to confirm.",
  },
  {
    q: "Can I swap more than once with the same person?",
    a: "Absolutely. Many users form long-term swap partnerships. You can schedule multiple sessions, adjust frequency, and extend your swap arrangement at any time.",
  },
  {
    q: "How are matches calculated?",
    a: "Our matching algorithm looks at complementary skill pairs — what you teach vs. what your potential partner wants to learn, and vice versa. It also factors in availability, language, and skill level to find your best-fit partners.",
  },
  {
    q: "How do I edit my profile?",
    a: "Go to Profile → Edit Profile (or Settings). You can update your bio, skills, availability, and language preferences at any time.",
  },
  {
    q: "How do I report a user?",
    a: "Visit the user's profile and click the flag icon, or use the report option in any chat message. Our trust & safety team reviews every report within 48 hours.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings → Account → Delete Account. This permanently removes your profile and all associated data within 30 days. This action cannot be undone.",
  },
];

const channels = [
  {
    icon: Mail,
    color: "bg-indigo-100 text-indigo-600",
    title: "Email Support",
    desc: "For account issues, billing questions, or anything that needs a detailed response.",
    action: "support@skillswap.app",
    href: "mailto:support@skillswap.app",
    cta: "Send an email",
  },
  {
    icon: Flag,
    color: "bg-rose-100 text-rose-600",
    title: "Report Safety Issues",
    desc: "Harassment, threats, or policy violations. We review all reports within 48 hours.",
    action: "safety@skillswap.app",
    href: "mailto:safety@skillswap.app",
    cta: "Report now",
  },
  {
    icon: BookOpen,
    color: "bg-emerald-100 text-emerald-600",
    title: "Community Guidelines",
    desc: "Read the rules that keep SkillSwap safe and fair for all members.",
    href: "/guidelines",
    cta: "View guidelines",
  },
  {
    icon: MessageCircle,
    color: "bg-amber-100 text-amber-600",
    title: "Feature Requests",
    desc: "Have an idea to improve SkillSwap? We'd love to hear it.",
    action: "hello@skillswap.app",
    href: "mailto:hello@skillswap.app",
    cta: "Share your idea",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-medium pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm border-t bg-muted/10">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src={logoPath} alt="SkillSwap" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">SkillSwap</span>
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* Hero */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Support Centre</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Find answers to common questions, or reach out to our team directly. We're here to help.
          </p>
        </div>

        {/* Contact channels */}
        <section>
          <h2 className="text-xl font-semibold mb-5">Get in Touch</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="p-5 rounded-xl border bg-card flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", c.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold">{c.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  <a
                    href={c.href}
                    className="text-sm text-primary font-medium hover:underline mt-auto"
                  >
                    {c.cta} →
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact form */}
        <section>
          <h2 className="text-xl font-semibold mb-5">Send Us a Message</h2>
          {submitted ? (
            <div className="p-8 rounded-xl border bg-emerald-50 dark:bg-emerald-900/10 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Message sent!</h3>
              <p className="text-muted-foreground text-sm">We'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl border bg-card">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your name" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Subject</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>General question</option>
                  <option>Account issue</option>
                  <option>Report a user</option>
                  <option>Technical problem</option>
                  <option>Feature request</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="w-full min-h-[130px] px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Describe your issue or question in as much detail as possible…"
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto px-8">
                Send Message
              </Button>
            </form>
          )}
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-semibold mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* Still stuck */}
        <section className="p-8 rounded-2xl border bg-primary/5 text-center">
          <h3 className="font-semibold text-lg mb-2">Still need help?</h3>
          <p className="text-muted-foreground text-sm mb-5">
            Our support team typically responds within one business day.
          </p>
          <a href="mailto:support@skillswap.app">
            <Button>Email Support</Button>
          </a>
        </section>

      </main>

      <footer className="border-t bg-muted/30 py-8 px-6 mt-10">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/guidelines" className="hover:text-foreground transition-colors">Guidelines</Link>
          <Link href="/support" className="hover:text-foreground transition-colors font-medium text-foreground">Support</Link>
        </div>
      </footer>
    </div>
  );
}
