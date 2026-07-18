import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { ArrowRight, Code, Music, Camera, Briefcase, Languages, BookOpen, Dumbbell, Zap, Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const floatingCards = [
  { initials: "SJ", color: "bg-purple-500", name: "Sarah Johnson", teaches: "Guitar", wants: "Python" },
  { initials: "AS", color: "bg-indigo-500", name: "Arjun Sharma", teaches: "Python", wants: "Guitar" },
  { initials: "ED", color: "bg-rose-500", name: "Emily Davis", teaches: "UI/UX Design", wants: "Marketing" },
  { initials: "MA", color: "bg-emerald-500", name: "Mike Anderson", teaches: "Photography", wants: "React" },
];

const categories = [
  { icon: Code, name: "Technology", color: "bg-indigo-100 text-indigo-600" },
  { icon: Music, name: "Music", color: "bg-rose-100 text-rose-600" },
  { icon: Camera, name: "Creative Arts", color: "bg-emerald-100 text-emerald-600" },
  { icon: Briefcase, name: "Business", color: "bg-amber-100 text-amber-600" },
  { icon: Languages, name: "Languages", color: "bg-purple-100 text-purple-600" },
  { icon: BookOpen, name: "Academics", color: "bg-blue-100 text-blue-600" },
  { icon: Dumbbell, name: "Fitness", color: "bg-orange-100 text-orange-600" },
  { icon: Zap, name: "Life Skills", color: "bg-cyan-100 text-cyan-600" },
];

const howItWorks = [
  { step: "1", title: "Create Your Profile", desc: "List the skills you can teach and the skills you want to learn." },
  { step: "2", title: "Get Matched", desc: "Our algorithm finds your perfect skill-swap partners automatically." },
  { step: "3", title: "Schedule & Swap", desc: "Book sessions, chat with partners, and exchange knowledge over Google Meet." },
];

const testimonials = [
  { initials: "SJ", color: "bg-purple-500", name: "Sarah Johnson", role: "Guitar Teacher", text: "I learned Python in 3 months by teaching guitar. SkillSwap changed how I think about learning.", rating: 5 },
  { initials: "MA", color: "bg-emerald-500", name: "Mike Anderson", role: "Photographer", text: "Found an amazing React tutor who wanted photography lessons. Best exchange I've ever made!", rating: 5 },
  { initials: "ED", color: "bg-rose-500", name: "Emily Davis", role: "UI/UX Designer", text: "The platform feels premium and the matching is surprisingly accurate. Highly recommend.", rating: 5 },
];

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src={logoPath} alt="SkillSwap" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">SkillSwap</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          <Link href="/marketplace" className="hover:text-foreground transition-colors">Browse Skills</Link>
          <a href="#categories" className="hover:text-foreground transition-colors">Become a Teacher</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <Link href="/register">
            <Button size="sm" className="px-5">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero — two-column */}
        <section className="py-16 md:py-24 px-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Learn What You Need.<br />
                <span className="text-foreground">Teach</span>{" "}
                <span className="text-primary">What You Know.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                SkillSwap is a peer-to-peer platform where thousands of people exchange skills, build connections, and grow together. No money — just knowledge.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="h-12 px-8">Browse Skills</Button>
                </Link>
              </div>

              {/* Stats inline */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t">
                {[
                  { value: "12K+", label: "Active Users" },
                  { value: "8K+", label: "Skills Shared" },
                  { value: "25K+", label: "Sessions Completed" },
                  { value: "4.9★", label: "User Rating" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: floating profile cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[420px] hidden lg:block"
            >
              {floatingCards.map((card, i) => (
                <motion.div
                  key={card.initials}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className={cn(
                    "absolute bg-white border border-border rounded-2xl shadow-lg p-4 w-52",
                    i === 0 && "top-0 left-10",
                    i === 1 && "top-8 right-0",
                    i === 2 && "bottom-16 left-0",
                    i === 3 && "bottom-0 right-16",
                  )}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm", card.color)}>
                      {card.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{card.name}</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-muted-foreground">Verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teaches</span>
                      <span className="font-medium text-primary">{card.teaches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wants</span>
                      <span className="font-medium text-emerald-600">{card.wants}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Center arrow connecting cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 px-6 bg-muted/30 border-y">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3">How SkillSwap Works</h2>
              <p className="text-muted-foreground">Three simple steps to start learning and teaching.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-5">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Explore Categories</h2>
              <p className="text-muted-foreground">Find partners across 8 skill domains.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-2xl border bg-card hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group text-center"
                  >
                    <div className={cn("w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110", cat.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">{cat.name}</h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-muted/30 border-t">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">What Our Members Say</h2>
              <p className="text-muted-foreground">Join thousands of happy learners and teachers.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs", t.color)}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-primary text-primary-foreground text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Ready to share your knowledge?</h2>
            <p className="text-xl opacity-85 mb-8">Join thousands of learners and teachers trading skills every day.</p>
            <Link href="/register">
              <Button size="lg" className="h-12 px-10 bg-white text-primary hover:bg-gray-100 font-semibold">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 border-t bg-muted/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-2">
            <img src={logoPath} alt="SkillSwap" className="h-6 w-6 opacity-60" />
            <span className="font-semibold text-muted-foreground text-sm">SkillSwap © 2024</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Guidelines</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
