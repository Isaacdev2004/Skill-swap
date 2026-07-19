import { sessionRepository } from "@/modules/sessions/repositories/session.repository";
import { notificationService } from "@/modules/notifications/services/notification.service";
import { emailService } from "@/emails/email.service";
import { NotificationType } from "@/common/constants/enums";
import { logger } from "@/common/utils/logger";

const REMINDER_WINDOW_MS = 60 * 60 * 1000;

export function startCronJobs(): void {
  setInterval(() => {
    void sendSessionReminders();
  }, 15 * 60 * 1000);

  logger.info("Cron jobs started");
}

async function sendSessionReminders(): Promise<void> {
  const before = new Date(Date.now() + REMINDER_WINDOW_MS);
  const sessions = await sessionRepository.findUpcomingForReminder(before);

  for (const session of sessions) {
    const host = session.host as unknown as { _id: { toString(): string }; name: string; email?: string };
    const participant = session.participant as unknown as {
      _id: { toString(): string };
      name: string;
      email?: string;
    };

    for (const user of [host, participant]) {
      await notificationService.create({
        userId: user._id.toString(),
        type: NotificationType.SESSION_REMINDER,
        title: "Upcoming session",
        message: `Reminder: "${session.title}" starts soon`,
        data: { sessionId: session._id.toString() },
      });

      if (user.email) {
        await emailService.sendSessionReminder(user.email, session.title, session.scheduledAt);
      }
    }

    await sessionRepository.update(session._id.toString(), { reminderSent: true });
  }
}
