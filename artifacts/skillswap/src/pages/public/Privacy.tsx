import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import logoPath from "@assets/skillswaplogo_1784374390885.png";

export default function Privacy() {
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
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: January 1, 2024</p>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your privacy matters to us. This policy explains what information we collect, how we use it, and the choices you have.
          </p>
        </div>

        <div className="space-y-10 text-foreground">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect information you provide directly to us:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li><strong className="text-foreground">Account information</strong> — name, email address, and password when you register.</li>
              <li><strong className="text-foreground">Profile information</strong> — bio, languages spoken, availability, and skills you teach or want to learn.</li>
              <li><strong className="text-foreground">Communications</strong> — messages you send to other users through our chat feature.</li>
              <li><strong className="text-foreground">Usage data</strong> — pages visited, features used, and actions taken on the platform.</li>
              <li><strong className="text-foreground">Device information</strong> — browser type, operating system, and IP address.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>To create and maintain your account.</li>
              <li>To match you with compatible skill-swap partners.</li>
              <li>To facilitate messaging and session scheduling between users.</li>
              <li>To send you notifications about swap requests, messages, and sessions.</li>
              <li>To improve and personalise your experience on the platform.</li>
              <li>To detect and prevent fraud, abuse, and security incidents.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not sell your personal information. We may share it only in these circumstances:
            </p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li><strong className="text-foreground">With other users</strong> — your public profile (name, skills, rating, bio) is visible to other SkillSwap members.</li>
              <li><strong className="text-foreground">Service providers</strong> — trusted third parties who help us operate the platform (e.g. hosting, email delivery) under strict data-processing agreements.</li>
              <li><strong className="text-foreground">Legal requirements</strong> — when required by law or to protect the rights and safety of users.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to keep you logged in, remember your preferences, and analyse usage. You can disable cookies in your browser settings, though some features may not work correctly without them.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide our services. If you delete your account, we will delete or anonymise your personal data within 30 days, unless we are required to retain it for legal purposes.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use industry-standard security measures to protect your information, including encrypted storage and HTTPS in transit. No method of transmission over the internet is 100% secure, so we encourage you to use a strong, unique password.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>Access the personal information we hold about you.</li>
              <li>Correct inaccurate or incomplete information.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict how we process your data.</li>
              <li>Export your data in a portable format.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@skillswap.app" className="text-primary hover:underline">privacy@skillswap.app</a>.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              SkillSwap is not intended for users under 18. We do not knowingly collect personal information from minors. If you believe a child has provided us with their information, please contact us immediately.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We'll notify you of material changes via email or a prominent notice on the platform before the changes take effect.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Privacy questions or concerns? Email us at{" "}
              <a href="mailto:privacy@skillswap.app" className="text-primary hover:underline">privacy@skillswap.app</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-8 px-6 mt-10">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors font-medium text-foreground">Privacy</Link>
          <Link href="/guidelines" className="hover:text-foreground transition-colors">Guidelines</Link>
          <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
