export type SkillCategory = "Technology" | "Creative Arts" | "Music" | "Business" | "Languages" | "Academics" | "Fitness" | "Life Skills";

export interface SkillTag {
  id: string;
  name: string;
  category: SkillCategory;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: "initials";
  initials: string;
  avatarColor: string;
  bio: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  isAdmin: boolean;
  languages: string[];
  availability: { days: string[]; timeSlot: string };
  skillsTeach: SkillTag[];
  skillsLearn: SkillTag[];
  badges: Badge[];
  joinedAt: string;
}

export interface Match {
  id: string;
  user: User;
  compatibilityScore: number;
  theyTeach: SkillTag[];
  theyWant: SkillTag[];
  mutualSkills: string[];
  status: "pending" | "connected" | "rejected";
}

export interface SwapRequest {
  id: string;
  fromUser: User;
  toUser: User;
  theyTeach: SkillTag;
  theyWant: SkillTag;
  frequency: string;
  duration: number;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface Session {
  id: string;
  withUser: User;
  skill: SkillTag;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "completed" | "cancelled";
  googleMeetLink?: string;
  notes?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastAt: string;
  unread: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  type: "text" | "meet-link";
}

export interface Review {
  id: string;
  reviewer: User;
  rating: number;
  comment: string;
  recommend: boolean;
  session: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "match" | "message" | "session" | "review" | "request";
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export const USERS: User[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    email: "arjun@example.com",
    avatar: "initials",
    initials: "AS",
    avatarColor: "bg-indigo-500",
    bio: "Full-stack engineer passionate about teaching clean code. Looking to learn guitar and basic photography to express my creative side.",
    rating: 4.8,
    reviewCount: 42,
    verified: true,
    isAdmin: false,
    languages: ["English", "Hindi"],
    availability: { days: ["Mon", "Wed", "Sat"], timeSlot: "Evening" },
    skillsTeach: [
      { id: "s1", name: "Python", category: "Technology", level: "Advanced" },
      { id: "s2", name: "React", category: "Technology", level: "Advanced" }
    ],
    skillsLearn: [
      { id: "s3", name: "Guitar", category: "Music", level: "Beginner" },
      { id: "s4", name: "Photography", category: "Creative Arts", level: "Beginner" }
    ],
    badges: [{ id: "b1", name: "Top Teacher", icon: "award" }],
    joinedAt: "2023-01-15T00:00:00Z"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "initials",
    initials: "SJ",
    avatarColor: "bg-purple-500",
    bio: "Professional musician looking to build my own website and learn coding. Patient teacher with 10 years of experience.",
    rating: 4.9,
    reviewCount: 86,
    verified: true,
    isAdmin: false,
    languages: ["English"],
    availability: { days: ["Tue", "Thu", "Sun"], timeSlot: "Morning" },
    skillsTeach: [
      { id: "s3", name: "Guitar", category: "Music", level: "Advanced" },
      { id: "s5", name: "Piano", category: "Music", level: "Advanced" }
    ],
    skillsLearn: [
      { id: "s1", name: "Python", category: "Technology", level: "Beginner" },
      { id: "s6", name: "JavaScript", category: "Technology", level: "Beginner" }
    ],
    badges: [{ id: "b2", name: "Community Favorite", icon: "heart" }],
    joinedAt: "2023-03-20T00:00:00Z"
  },
  {
    id: "3",
    name: "Mike Anderson",
    email: "mike@example.com",
    avatar: "initials",
    initials: "MA",
    avatarColor: "bg-emerald-500",
    bio: "Freelance photographer aiming to shift into tech. Happy to teach composition, lighting, and editing.",
    rating: 4.7,
    reviewCount: 24,
    verified: false,
    isAdmin: false,
    languages: ["English", "Spanish"],
    availability: { days: ["Sat", "Sun"], timeSlot: "Afternoon" },
    skillsTeach: [
      { id: "s4", name: "Photography", category: "Creative Arts", level: "Advanced" }
    ],
    skillsLearn: [
      { id: "s2", name: "React", category: "Technology", level: "Beginner" },
      { id: "s7", name: "UI Design", category: "Technology", level: "Beginner" }
    ],
    badges: [],
    joinedAt: "2023-06-10T00:00:00Z"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "initials",
    initials: "ED",
    avatarColor: "bg-rose-500",
    bio: "UX/UI designer for a fintech startup. Interested in marketing and python for data analysis.",
    rating: 4.8,
    reviewCount: 51,
    verified: true,
    isAdmin: true,
    languages: ["English", "French"],
    availability: { days: ["Wed", "Fri"], timeSlot: "Evening" },
    skillsTeach: [
      { id: "s7", name: "UI Design", category: "Technology", level: "Advanced" },
      { id: "s8", name: "UX Research", category: "Technology", level: "Advanced" }
    ],
    skillsLearn: [
      { id: "s9", name: "Digital Marketing", category: "Business", level: "Beginner" },
      { id: "s1", name: "Python", category: "Technology", level: "Beginner" }
    ],
    badges: [{ id: "b3", name: "Super Swapper", icon: "zap" }],
    joinedAt: "2022-11-05T00:00:00Z"
  },
  {
    id: "5",
    name: "David Lee",
    email: "david@example.com",
    avatar: "initials",
    initials: "DL",
    avatarColor: "bg-amber-500",
    bio: "Marketing strategist. Need to understand design to better communicate with my product team.",
    rating: 4.6,
    reviewCount: 19,
    verified: false,
    isAdmin: false,
    languages: ["English", "Korean"],
    availability: { days: ["Mon", "Tue", "Wed"], timeSlot: "Night" },
    skillsTeach: [
      { id: "s9", name: "Digital Marketing", category: "Business", level: "Advanced" }
    ],
    skillsLearn: [
      { id: "s7", name: "UI Design", category: "Technology", level: "Beginner" }
    ],
    badges: [],
    joinedAt: "2023-08-22T00:00:00Z"
  }
];

export const CURRENT_USER = USERS[0]; // Arjun Sharma

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    user: USERS[1], // Sarah Johnson
    compatibilityScore: 92,
    theyTeach: [USERS[1].skillsTeach[0]], // Guitar
    theyWant: [USERS[1].skillsLearn[0]], // Python
    mutualSkills: ["Python", "Guitar"],
    status: "pending"
  },
  {
    id: "m2",
    user: USERS[2], // Mike Anderson
    compatibilityScore: 85,
    theyTeach: [USERS[2].skillsTeach[0]], // Photography
    theyWant: [USERS[2].skillsLearn[0]], // React
    mutualSkills: ["React", "Photography"],
    status: "connected"
  }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: "sess1",
    withUser: USERS[1],
    skill: USERS[1].skillsTeach[0], // Guitar
    date: "2024-11-20",
    time: "18:00",
    duration: 60,
    status: "upcoming",
    googleMeetLink: "https://meet.google.com/abc-defg-hij",
    notes: "Focusing on basic chords"
  },
  {
    id: "sess2",
    withUser: USERS[2],
    skill: CURRENT_USER.skillsTeach[1], // React
    date: "2024-11-22",
    time: "19:00",
    duration: 45,
    status: "upcoming",
    googleMeetLink: "https://meet.google.com/xyz-uvwx-yz"
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    participant: USERS[1],
    lastMessage: "Looking forward to our session!",
    lastAt: "2024-11-15T14:30:00Z",
    unread: 2,
    isOnline: true
  },
  {
    id: "conv2",
    participant: USERS[2],
    lastMessage: "Can you send the react tutorial link?",
    lastAt: "2024-11-14T09:15:00Z",
    unread: 0,
    isOnline: false
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv1": [
    { id: "msg1", senderId: USERS[1].id, text: "Hi Arjun! I saw we match 92%. I really need help with Python.", sentAt: "2024-11-14T10:00:00Z", type: "text" },
    { id: "msg2", senderId: CURRENT_USER.id, text: "Hey Sarah! Yes, I can definitely help with Python. And I've been dying to learn Guitar.", sentAt: "2024-11-14T10:05:00Z", type: "text" },
    { id: "msg3", senderId: USERS[1].id, text: "Perfect! Let's schedule a session.", sentAt: "2024-11-14T10:10:00Z", type: "text" },
    { id: "msg4", senderId: USERS[1].id, text: "https://meet.google.com/abc-defg-hij", sentAt: "2024-11-15T14:28:00Z", type: "meet-link" },
    { id: "msg5", senderId: USERS[1].id, text: "Looking forward to our session!", sentAt: "2024-11-15T14:30:00Z", type: "text" }
  ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif1",
    type: "match",
    title: "New 90%+ Match!",
    body: "Sarah Johnson is a 92% match for your skills.",
    isRead: false,
    createdAt: "2024-11-15T10:00:00Z"
  },
  {
    id: "notif2",
    type: "session",
    title: "Session Reminder",
    body: "You have a session with Mike in 1 hour.",
    isRead: true,
    createdAt: "2024-11-14T18:00:00Z"
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev1",
    reviewer: USERS[2],
    rating: 5,
    comment: "Arjun explains React concepts so clearly! Great session.",
    recommend: true,
    session: "sess-past-1",
    createdAt: "2024-10-20T00:00:00Z"
  },
  {
    id: "rev2",
    reviewer: USERS[1],
    rating: 4.5,
    comment: "Very patient teacher. Python is starting to make sense.",
    recommend: true,
    session: "sess-past-2",
    createdAt: "2024-11-05T00:00:00Z"
  }
];
