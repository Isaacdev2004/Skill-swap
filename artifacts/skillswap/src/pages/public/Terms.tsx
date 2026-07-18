import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import logoPath from "@assets/skillswaplogo_1784374390885.png";

export default function Terms() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Please read these Terms of Service carefully before using SkillSwap. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By creating an account or using SkillSwap in any way, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              SkillSwap is a peer-to-peer skill exchange platform that connects people who want to teach and learn skills. Users exchange knowledge directly — no money changes hands through SkillSwap. Sessions are conducted via Google Meet or other agreed-upon video platforms.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>You must be at least 18 years old to create an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>You may not create more than one account per person.</li>
              <li>SkillSwap reserves the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You agree not to use SkillSwap to:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>Post false, misleading, or fraudulent information about your skills.</li>
              <li>Harass, bully, or discriminate against other users.</li>
              <li>Exchange money, goods, or services outside of skill swaps.</li>
              <li>Spam other users with unsolicited messages or swap requests.</li>
              <li>Violate any applicable laws or regulations.</li>
              <li>Attempt to gain unauthorised access to other accounts or our systems.</li>
            </ul>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Skill Exchange Agreement</h2>
            <p className="text-muted-foreground leading-relaxed">
              When two users agree to a skill swap, they enter into a direct agreement with each other. SkillSwap facilitates the connection but is not a party to any individual swap arrangement. We are not responsible for the quality, safety, legality, or any other aspect of skills exchanged between users.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Content & Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of any content you create and share on SkillSwap. By posting content, you grant SkillSwap a non-exclusive, royalty-free licence to display, reproduce, and distribute that content solely to operate the platform. SkillSwap's name, logo, and all related intellectual property belong to us and may not be used without written permission.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Ratings & Reviews</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ratings and reviews must be honest, fair, and based on genuine experiences. SkillSwap reserves the right to remove reviews that contain hate speech, personal attacks, or are otherwise in violation of these terms.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              SkillSwap is provided "as is" without warranties of any kind. To the fullest extent permitted by law, SkillSwap is not liable for any indirect, incidental, special, or consequential damages arising from your use of — or inability to use — the platform.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms from time to time. We'll notify you of significant changes via email or an in-app notice. Continued use of SkillSwap after changes take effect constitutes acceptance of the updated terms.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms? Reach us at{" "}
              <a href="mailto:legal@skillswap.app" className="text-primary hover:underline">legal@skillswap.app</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t bg-muted/30 py-8 px-6 mt-10">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors font-medium text-foreground">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/guidelines" className="hover:text-foreground transition-colors">Guidelines</Link>
          <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
