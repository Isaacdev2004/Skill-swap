import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logoPath from "@assets/skillswaplogo_1784374390885.png";
import { ArrowRight, Code, Music, Camera, Briefcase, Languages, BookOpen, Dumbbell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Landing() {
  const categories = [
    { icon: Code, name: "Technology", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { icon: Music, name: "Music", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
    { icon: Camera, name: "Creative Arts", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { icon: Briefcase, name: "Business", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    { icon: Languages, name: "Languages", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
    { icon: BookOpen, name: "Academics", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { icon: Dumbbell, name: "Fitness", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
    { icon: Zap, name: "Life Skills", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src={logoPath} alt="SkillSwap" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">SkillSwap</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-32 px-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-6"
            >
              Learn What You Need.<br />
              <span className="text-primary">Teach What You Know.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              A peer-to-peer skill exchange platform where people trade knowledge instead of money. Connect with experts, share your passion, and grow together.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                  Start Swapping <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto">
                  Explore Skills
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "12K+", label: "Active Users" },
              { value: "8K+", label: "Skills Listed" },
              { value: "25K+", label: "Sessions Completed" },
              { value: "4.9★", label: "Average Rating" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col"
              >
                <span className="text-4xl font-bold text-foreground mb-2">{stat.value}</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Find people looking to trade skills in exactly what you want to learn.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.div 
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 text-center"
                  >
                    <div className={cn("w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110", cat.color)}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-primary text-primary-foreground text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to share your knowledge?</h2>
            <p className="text-xl opacity-90 mb-10">Join thousands of learners and teachers trading skills every day.</p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg text-primary bg-white hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t bg-muted/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={logoPath} alt="SkillSwap" className="h-6 w-6 grayscale opacity-50" />
            <span className="font-semibold text-muted-foreground">SkillSwap © 2024</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Guidelines</a>
            <a href="#" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
