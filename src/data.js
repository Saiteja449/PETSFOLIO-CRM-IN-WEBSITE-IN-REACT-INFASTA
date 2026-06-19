export const users = [
  {
    id: "u1",
    name: "Alex Mercer",
    role: "Sales Manager",
    email: "alex@petsfolio.com",
    avatar: "AM",
  },
  {
    id: "u2",
    name: "Sarah Connor",
    role: "Sales Representative",
    email: "sarah@petsfolio.com",
    avatar: "SC",
  },
  {
    id: "u3",
    name: "David Miller",
    role: "Sales Representative",
    email: "david@petsfolio.com",
    avatar: "DM",
  },
  {
    id: "u4",
    name: "Emily Davis",
    role: "Sales Representative",
    email: "emily@petsfolio.com",
    avatar: "ED",
  },
];

export const services = [
  {
    id: "s1",
    name: "Grooming",
    code: "Grooming",
    active: true,
    color: "#2563eb",
  },
  {
    id: "s2",
    name: "Training",
    code: "Training",
    active: true,
    color: "#16a34a",
  },
  {
    id: "s3",
    name: "Walking",
    code: "Walking",
    active: true,
    color: "#ea580c",
  },
  {
    id: "s4",
    name: "Pet Sitting",
    code: "Pet Sitting",
    active: true,
    color: "#db2777",
  },
  {
    id: "s5",
    name: "Pet Insurance",
    code: "Pet Insurance",
    active: true,
    color: "#7c3aed",
  },
];



// Empty Leads array for API integration
export const initialLeads = [];

export const initialFollowups = [];

export const initialActivities = [];

export const initialNotifications = [
  {
    id: "nt1",
    type: "followup_overdue",
    title: "Follow-up Overdue",
    message:
      "Walk Renewal follow-up with Steven Walker (Ruby) is overdue since 2026-05-24.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "nt2",
    type: "lead_inactive",
    title: "Inactive Lead Warning",
    message: "Lead Kenneth Perez has had no activity for over 6 days.",
    time: "4 hours ago",
    read: false,
  },
  {
    id: "nt3",
    type: "insurance_renewal",
    title: "Insurance Renewal Due",
    message: "Kenneth Perez's Siberian Husky (Bear) policy expires in 10 days.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "nt4",
    type: "grooming_reminder",
    title: "Grooming Appointment Reminder",
    message: "Robert Johnson (Rocky) tomorrow scheduled at 10:00 AM.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "nt5",
    type: "walking_expiring",
    title: "Walking Subscription Expiring",
    message: "Steven Walker walking subscription expiring in 2 days.",
    time: "2 days ago",
    read: true,
  },
];

export const leadSources = [
  { name: "Meta", count: 12 },
  { name: "Whatsapp", count: 9 },
  { name: "Social Media", count: 6 },
  { name: "Email", count: 3 },
  { name: "Email", count: 2 },
];
