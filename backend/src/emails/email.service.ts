import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "@/config/env";
import { logger } from "@/common/utils/logger";

class EmailService {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter | null {
    if (!env.SMTP_HOST || !env.SMTP_USER) {
      return null;
    }

    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }

    return this.transporter;
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<void> {
    const transporter = this.getTransporter();

    if (!transporter) {
      logger.debug("Email skipped — SMTP not configured", { to: options.to, subject: options.subject });
      return;
    }

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "Welcome to SkillSwap",
      html: `<p>Hi ${name},</p><p>Welcome to SkillSwap! Start exchanging skills today.</p>`,
      text: `Hi ${name}, Welcome to SkillSwap!`,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.sendMail({
      to,
      subject: "Reset your SkillSwap password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      text: `Reset your password: ${resetUrl}`,
    });
  }

  async sendSessionReminder(to: string, sessionTitle: string, scheduledAt: Date): Promise<void> {
    await this.sendMail({
      to,
      subject: `Session reminder: ${sessionTitle}`,
      html: `<p>Your session "${sessionTitle}" is scheduled for ${scheduledAt.toISOString()}.</p>`,
    });
  }
}

export const emailService = new EmailService();
