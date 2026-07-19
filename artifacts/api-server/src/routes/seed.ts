import { Router } from "express";
import bcrypt from "bcrypt";
import pool from "../lib/pool.js";

const router = Router();

// POST /api/seed — idempotent seed (only runs if no users exist)
router.post("/seed", async (_req, res, next) => {
  try {
    const check = await pool.query("SELECT COUNT(*) AS cnt FROM users");
    if (parseInt(check.rows[0].cnt) > 0) {
      res.json({ message: "Already seeded", skipped: true });
      return;
    }

    const hash = await bcrypt.hash("password123", 10);

    const seeds = [
      { name: "Arjun Sharma",  email: "arjun@example.com",  color: "bg-indigo-500", isAdmin: false, isVerified: true,  bio: "Full-stack engineer passionate about teaching clean code. Looking to learn guitar and basic photography.", languages: ["English","Hindi"], days: ["Mon","Wed","Sat"], slot: "Evening", teach: [["Python","Technology","Advanced"],["React","Technology","Advanced"]], learn: [["Guitar","Music","Beginner"],["Photography","Creative Arts","Beginner"]], badge: "Top Teacher", rating: 4.8, reviews: 42 },
      { name: "Sarah Johnson", email: "sarah@example.com",  color: "bg-purple-500", isAdmin: false, isVerified: true,  bio: "Professional musician looking to build my own website. Patient teacher with 10 years of experience.", languages: ["English"], days: ["Tue","Thu","Sun"], slot: "Morning", teach: [["Guitar","Music","Advanced"],["Piano","Music","Advanced"]], learn: [["Python","Technology","Beginner"],["JavaScript","Technology","Beginner"]], badge: "Community Favorite", rating: 4.9, reviews: 86 },
      { name: "Mike Anderson", email: "mike@example.com",   color: "bg-emerald-500",isAdmin: false, isVerified: false, bio: "Freelance photographer aiming to shift into tech. Happy to teach composition and lighting.", languages: ["English","Spanish"], days: ["Sat","Sun"], slot: "Afternoon", teach: [["Photography","Creative Arts","Advanced"]], learn: [["React","Technology","Beginner"],["UI Design","Technology","Beginner"]], badge: null, rating: 4.7, reviews: 24 },
      { name: "Emily Davis",   email: "emily@example.com",  color: "bg-rose-500",   isAdmin: true,  isVerified: true,  bio: "UX/UI designer for a fintech startup. Interested in marketing and Python for data analysis.", languages: ["English","French"], days: ["Wed","Fri"], slot: "Evening", teach: [["UI Design","Technology","Advanced"],["UX Research","Technology","Advanced"]], learn: [["Digital Marketing","Business","Beginner"],["Python","Technology","Beginner"]], badge: "Super Swapper", rating: 4.8, reviews: 51 },
      { name: "David Lee",     email: "david@example.com",  color: "bg-amber-500",  isAdmin: false, isVerified: false, bio: "Marketing strategist. Need to understand design to better communicate with my product team.", languages: ["English","Korean"], days: ["Mon","Tue","Wed"], slot: "Night", teach: [["Digital Marketing","Business","Advanced"]], learn: [["UI Design","Technology","Beginner"]], badge: null, rating: 4.6, reviews: 19 },
    ];

    const userIds: string[] = [];

    for (const s of seeds) {
      const initials = s.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
      const r = await pool.query(
        `INSERT INTO users (name, email, password_hash, bio, languages, availability_days, availability_time_slot, avatar_color, initials, is_admin, is_verified, rating, review_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
        [s.name, s.email, hash, s.bio, s.languages, s.days, s.slot, s.color, initials, s.isAdmin, s.isVerified, s.rating, s.reviews]
      );
      const uid = r.rows[0].id;
      userIds.push(uid);

      for (const [name, cat, level] of s.teach) {
        await pool.query("INSERT INTO skills (user_id, name, category, level, type) VALUES ($1,$2,$3,$4,'teach')", [uid, name, cat, level]);
      }
      for (const [name, cat, level] of s.learn) {
        await pool.query("INSERT INTO skills (user_id, name, category, level, type) VALUES ($1,$2,$3,$4,'learn')", [uid, name, cat, level]);
      }
      if (s.badge) {
        await pool.query("INSERT INTO badges (user_id, name, icon) VALUES ($1,$2,'award')", [uid, s.badge]);
      }
    }

    // Seed conversations & messages between Arjun (0) and Sarah (1)
    const convR = await pool.query(
      "INSERT INTO conversations (user1_id, user2_id) VALUES ($1,$2) RETURNING id",
      [userIds[0], userIds[1]]
    );
    const convId = convR.rows[0].id;
    const msgs = [
      { sid: userIds[1], text: "Hi Arjun! I saw we match well. I really need help with Python.", type: "text" },
      { sid: userIds[0], text: "Hey Sarah! Yes, I can help with Python. And I've been dying to learn Guitar.", type: "text" },
      { sid: userIds[1], text: "Perfect! Let's schedule a session.", type: "text" },
      { sid: userIds[1], text: "https://meet.google.com/abc-defg-hij", type: "meet-link" },
      { sid: userIds[1], text: "Looking forward to our session!", type: "text" },
    ];
    for (const m of msgs) {
      await pool.query("INSERT INTO messages (conversation_id, sender_id, text, type) VALUES ($1,$2,$3,$4)", [convId, m.sid, m.text, m.type]);
    }

    // Seed sessions
    await pool.query(
      `INSERT INTO sessions (user1_id, user2_id, skill_name, skill_category, date, time, duration, google_meet_link, notes)
       VALUES ($1,$2,'Guitar','Music','2025-08-20','18:00',60,'https://meet.google.com/abc-defg-hij','Focusing on basic chords')`,
      [userIds[0], userIds[1]]
    );
    await pool.query(
      `INSERT INTO sessions (user1_id, user2_id, skill_name, skill_category, date, time, duration, google_meet_link)
       VALUES ($1,$2,'React','Technology','2025-08-22','19:00',45,'https://meet.google.com/xyz-uvwx-yz')`,
      [userIds[0], userIds[2]]
    );

    // Seed swap requests
    await pool.query(
      `INSERT INTO swap_requests (from_user_id, to_user_id, teach_skill_name, learn_skill_name, frequency, duration, message)
       VALUES ($1,$2,'Python','Guitar','Weekly',60,'Hi Sarah! I''d love to exchange Python lessons for guitar lessons.')`,
      [userIds[0], userIds[1]]
    );

    // Seed notifications for Arjun
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body) VALUES ($1,'match','New Match!','Sarah Johnson is a great match for your skills.')`,
      [userIds[0]]
    );
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body, is_read) VALUES ($1,'session','Session Reminder','You have a session with Mike tomorrow.',true)`,
      [userIds[0]]
    );

    // Seed reviews
    await pool.query(
      `INSERT INTO reviews (reviewer_id, reviewee_id, rating, comment, recommend) VALUES ($1,$2,5,'Arjun explains React concepts so clearly! Great session.',true)`,
      [userIds[2], userIds[0]]
    );
    await pool.query(
      `INSERT INTO reviews (reviewer_id, reviewee_id, rating, comment, recommend) VALUES ($1,$2,4.5,'Very patient teacher. Python is starting to make sense.',true)`,
      [userIds[1], userIds[0]]
    );

    res.json({ message: "Seeded successfully", users: seeds.map((s) => s.email) });
  } catch (err) {
    next(err);
  }
});

export default router;
