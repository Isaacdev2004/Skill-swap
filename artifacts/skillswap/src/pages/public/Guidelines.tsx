import { Link } from "wouter";
import { ArrowLeft, Heart, Shield, Star, Users, MessageCircle, AlertTriangle } from "lucide-react";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { cn } from "@/lib/utils";

const principles = [
  {
    icon: Heart,
    color: "bg-rose-100 text-rose-600",
    title: "Be Respectful",
    desc: "Treat every member with kindness and professionalism. Everyone is here to learn and grow.",
  },
  {
    icon: Shield,
    color: "bg-indigo-100 text-indigo-600",
    title: "Be Honest",
    desc: "Represent your skills and experience accurately. Authenticity builds trust in our community.",
  },
  {
    icon: Star,
    color: "bg-amber-100 text-amber-600",
    title: "Be Committed",
    desc: "If you schedule a session, show up. Respect your partner's time just as you'd want yours respected.",
  },
  {
    icon: Users,
    color: "bg-emerald-100 text-emerald-600",
    title: "Be Inclusive",
    desc: "SkillSwap welcomes everyone regardless of background, experience level, or identity.",
  },
  {
    icon: MessageCircle,
    color: "bg-purple-100 text-purple-600",
    title: "Communicate Clearly",
    desc: "Set clear expectations before a swap begins — skill level, session length, goals, and frequency.",
  },
  {
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-600",
    title: "Report Problems",
    desc: "If you encounter harmful behaviour, report it. Our team reviews every report seriously.",
  },
];

export default function Guidelines() {
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

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-sm text-muted-foreground mb-2">Last updated: January 1, 2024</p>
          <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            SkillSwap is built on mutual respect and genuine knowledge-sharing. These guidelines help keep our community safe, fair, and enjoyable for everyone.
          </p>
        </div>

        {/* Core principles grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex gap-4 p-5 rounded-xl border bg-card">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", p.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-10">

          <section>
            <h2 className="text-xl font-semibold mb-3">Swap Etiquette</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-3 list-disc list-inside">
              <li>Agree on the scope and structure of your swap before the first session.</li>
              <li>Keep sessions on topic — both parties should get equal value from the exchange.</li>
              <li>If you need to cancel, give at least 24 hours' notice whenever possible.</li>
              <li>After a swap, leave an honest rating and review to help the community.</li>
              <li>Do not use swap sessions to solicit paid services or upsell external offerings.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">Prohibited Content & Behaviour</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">The following are strictly not allowed on SkillSwap:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-3 list-disc list-inside">
              <li>Harassment, bullying, or threatening behaviour of any kind.</li>
              <li>Discriminatory language or conduct based on race, gender, religion, nationality, disability, age, or sexual orientation.</li>
              <li>Sharing explicit, adult, or otherwise inappropriate content.</li>
              <li>Misrepresenting your identity, qualifications, or skill level.</li>
              <li>Soliciting money, gifts, or romantic relationships through the platform.</li>
              <li>Sharing another user's personal information without their consent (doxxing).</li>
              <li>Spamming swap requests, messages, or reviews.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">Profile Standards</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-3 list-disc list-inside">
              <li>Your profile must represent you as a real person using your real name.</li>
              <li>Skills listed under "I Teach" must be skills you can genuinely teach.</li>
              <li>Skill levels (Beginner / Intermediate / Advanced) should be self-assessed honestly.</li>
              <li>Profile bios must be written in a professional, respectful tone.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">Reviews & Ratings</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-3 list-disc list-inside">
              <li>Reviews must be based on a genuine swap experience.</li>
              <li>Focus feedback on the teaching and swap experience, not personal characteristics.</li>
              <li>Do not offer or accept incentives in exchange for positive reviews.</li>
              <li>Fabricated or retaliatory reviews will be removed.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">Enforcement</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Violations of these guidelines may result in:
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { step: "1st", action: "Warning", desc: "A formal notice explaining the violation." },
                { step: "2nd", action: "Suspension", desc: "Temporary loss of account access." },
                { step: "3rd", action: "Ban", desc: "Permanent removal from the platform." },
              ].map((e) => (
                <div key={e.step} className="p-4 rounded-xl border bg-muted/30 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{e.step} offence</div>
                  <div className="font-bold text-sm mb-1">{e.action}</div>
                  <div className="text-xs text-muted-foreground">{e.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
              Severe violations (e.g. harassment, threats, or illegal activity) may result in an immediate permanent ban without prior warning.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">Reporting</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you witness or experience a violation, please use the "Report" button on any profile, message, or review, or email us at{" "}
              <a href="mailto:safety@skillswap.app" className="text-primary hover:underline">safety@skillswap.app</a>. All reports are reviewed confidentially.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t bg-muted/30 py-8 px-6 mt-10">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/guidelines" className="hover:text-foreground transition-colors font-medium text-foreground">Guidelines</Link>
          <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
