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

export const initialFollowups = [
  {
    id: "fw_1",
    leadId: "lead_1",
    leadName: "John Doe",
    type: "WhatsApp",
    date: "2026-06-08",
    time: "10:00 AM",
    priority: "Medium",
    done: false,
    notes: "Ping regarding pricing structure options.",
    
  },
  {
    id: "fw_2",
    leadId: "lead_1",
    leadName: "John Doe",
    type: "Call",
    date: "2026-06-07",
    time: "10:00 AM",
    priority: "Low",
    done: false,
    notes: "Call to confirm scheduling and availability.",
    
  },
  {
    id: "fw_3",
    leadId: "lead_1",
    leadName: "John Doe",
    type: "Call",
    date: "2026-05-28",
    time: "10:00 AM",
    priority: "High",
    done: true,
    notes: "Call to confirm scheduling and availability.",
    
  },
  {
    id: "fw_4",
    leadId: "lead_7",
    leadName: "Matthew Martinez",
    type: "WhatsApp",
    date: "2026-06-04",
    time: "10:00 AM",
    priority: "Medium",
    done: true,
    notes: "Ping regarding pricing structure options.",
    
  },
  {
    id: "fw_5",
    leadId: "lead_7",
    leadName: "Matthew Martinez",
    type: "Call",
    date: "2026-06-06",
    time: "10:00 AM",
    priority: "Medium",
    done: false,
    notes: "Call to confirm scheduling and availability.",
    
  },
  {
    id: "fw_6",
    leadId: "lead_8",
    leadName: "Amanda Thomas",
    type: "WhatsApp",
    date: "2026-05-20",
    time: "10:00 AM",
    priority: "High",
    done: true,
    notes: "Ping regarding pricing structure options.",
    
  },
  {
    id: "fw_7",
    leadId: "lead_8",
    leadName: "Amanda Thomas",
    type: "Call",
    date: "2026-06-04",
    time: "10:00 AM",
    priority: "High",
    done: true,
    notes: "Call to confirm scheduling and availability.",
    
  },
  {
    id: "fw_8",
    leadId: "lead_8",
    leadName: "Amanda Thomas",
    type: "Email",
    date: "2026-06-07",
    time: "10:00 AM",
    priority: "Medium",
    done: false,
    notes: "Send follow up marketing materials and brochures.",
    
  },
  {
    id: "fw_9",
    leadId: "lead_9",
    leadName: "James Taylor",
    type: "Email",
    date: "2026-05-23",
    time: "10:00 AM",
    priority: "Medium",
    done: false,
    notes: "Send follow up marketing materials and brochures.",
    
  },
  {
    id: "fw_10",
    leadId: "lead_9",
    leadName: "James Taylor",
    type: "Call",
    date: "2026-06-08",
    time: "10:00 AM",
    priority: "Medium",
    done: false,
    notes: "Call to confirm scheduling and availability.",
    
  },
  {
    id: "fw_11",
    leadId: "lead_9",
    leadName: "James Taylor",
    type: "Call",
    date: "2026-05-22",
    time: "10:00 AM",
    priority: "Low",
    done: true,
    notes: "Call to confirm scheduling and availability.",
    
  },
  {
    id: "fw_12",
    leadId: "lead_10",
    leadName: "Sarah Jenkins",
    type: "Call",
    date: "2026-05-26",
    time: "10:00 AM",
    priority: "Medium",
    done: false,
    notes: "Call to confirm scheduling and availability.",
    
  },
  {
    id: "fw_13",
    leadId: "lead_10",
    leadName: "Sarah Jenkins",
    type: "Email",
    date: "2026-06-08",
    time: "10:00 AM",
    priority: "Medium",
    done: false,
    notes: "Send follow up marketing materials and brochures.",
    
  }
];

export const initialActivities = [
  {
    id: "act_1",
    leadId: "lead_1",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "John Doe",
    date: "2026-05-18T14:30:00Z"
  },
  {
    id: "act_2",
    leadId: "lead_2",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Alex Mercer",
    date: "2026-06-16T14:30:00Z"
  },
  {
    id: "act_3",
    leadId: "lead_2",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Alex Mercer",
    date: "2026-05-12T14:30:00Z"
  },
  {
    id: "act_4",
    leadId: "lead_3",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Sarah Connor",
    date: "2026-05-14T14:30:00Z"
  },
  {
    id: "act_5",
    leadId: "lead_3",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "John Doe",
    date: "2026-06-16T14:30:00Z"
  },
  {
    id: "act_6",
    leadId: "lead_4",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-05-12T14:30:00Z"
  },
  {
    id: "act_7",
    leadId: "lead_4",
    type: "Follow Up Set",
    content: "Scheduled a follow-up call for next week.",
    author: "Sarah Connor",
    date: "2026-05-10T14:30:00Z"
  },
  {
    id: "act_8",
    leadId: "lead_5",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Alex Mercer",
    date: "2026-05-12T14:30:00Z"
  },
  {
    id: "act_9",
    leadId: "lead_5",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Alex Mercer",
    date: "2026-06-14T14:30:00Z"
  },
  {
    id: "act_10",
    leadId: "lead_6",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Sarah Connor",
    date: "2026-05-14T14:30:00Z"
  },
  {
    id: "act_11",
    leadId: "lead_7",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Alex Mercer",
    date: "2026-05-12T14:30:00Z"
  },
  {
    id: "act_12",
    leadId: "lead_8",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-06-16T14:30:00Z"
  },
  {
    id: "act_13",
    leadId: "lead_8",
    type: "Follow Up Set",
    content: "Scheduled a follow-up call for next week.",
    author: "Alex Mercer",
    date: "2026-06-15T14:30:00Z"
  },
  {
    id: "act_14",
    leadId: "lead_9",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Sarah Connor",
    date: "2026-06-13T14:30:00Z"
  },
  {
    id: "act_15",
    leadId: "lead_10",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Alex Mercer",
    date: "2026-05-13T14:30:00Z"
  },
  {
    id: "act_16",
    leadId: "lead_10",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Alex Mercer",
    date: "2026-05-11T14:30:00Z"
  },
  {
    id: "act_17",
    leadId: "lead_11",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-06-14T14:30:00Z"
  },
  {
    id: "act_18",
    leadId: "lead_11",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Alex Mercer",
    date: "2026-05-19T14:30:00Z"
  },
  {
    id: "act_19",
    leadId: "lead_12",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Sarah Connor",
    date: "2026-05-19T14:30:00Z"
  },
  {
    id: "act_20",
    leadId: "lead_12",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Alex Mercer",
    date: "2026-05-13T14:30:00Z"
  },
  {
    id: "act_21",
    leadId: "lead_13",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "John Doe",
    date: "2026-05-18T14:30:00Z"
  },
  {
    id: "act_22",
    leadId: "lead_13",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-06-15T14:30:00Z"
  },
  {
    id: "act_23",
    leadId: "lead_14",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Alex Mercer",
    date: "2026-06-12T14:30:00Z"
  },
  {
    id: "act_24",
    leadId: "lead_14",
    type: "Follow Up Set",
    content: "Scheduled a follow-up call for next week.",
    author: "John Doe",
    date: "2026-06-14T14:30:00Z"
  },
  {
    id: "act_25",
    leadId: "lead_15",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "John Doe",
    date: "2026-06-14T14:30:00Z"
  },
  {
    id: "act_26",
    leadId: "lead_15",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Alex Mercer",
    date: "2026-05-12T14:30:00Z"
  },
  {
    id: "act_27",
    leadId: "lead_16",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Alex Mercer",
    date: "2026-05-15T14:30:00Z"
  },
  {
    id: "act_28",
    leadId: "lead_17",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Alex Mercer",
    date: "2026-06-15T14:30:00Z"
  },
  {
    id: "act_29",
    leadId: "lead_17",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "John Doe",
    date: "2026-05-16T14:30:00Z"
  },
  {
    id: "act_30",
    leadId: "lead_18",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "John Doe",
    date: "2026-05-11T14:30:00Z"
  },
  {
    id: "act_31",
    leadId: "lead_18",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "John Doe",
    date: "2026-05-16T14:30:00Z"
  },
  {
    id: "act_32",
    leadId: "lead_19",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Sarah Connor",
    date: "2026-05-11T14:30:00Z"
  },
  {
    id: "act_33",
    leadId: "lead_19",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-06-13T14:30:00Z"
  },
  {
    id: "act_34",
    leadId: "lead_20",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "John Doe",
    date: "2026-06-14T14:30:00Z"
  },
  {
    id: "act_35",
    leadId: "lead_20",
    type: "Follow Up Set",
    content: "Scheduled a follow-up call for next week.",
    author: "John Doe",
    date: "2026-06-13T14:30:00Z"
  },
  {
    id: "act_36",
    leadId: "lead_21",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "John Doe",
    date: "2026-06-16T14:30:00Z"
  },
  {
    id: "act_37",
    leadId: "lead_22",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Alex Mercer",
    date: "2026-05-19T14:30:00Z"
  },
  {
    id: "act_38",
    leadId: "lead_22",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-05-19T14:30:00Z"
  },
  {
    id: "act_39",
    leadId: "lead_23",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Sarah Connor",
    date: "2026-06-12T14:30:00Z"
  },
  {
    id: "act_40",
    leadId: "lead_24",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Alex Mercer",
    date: "2026-06-16T14:30:00Z"
  },
  {
    id: "act_41",
    leadId: "lead_24",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "John Doe",
    date: "2026-06-13T14:30:00Z"
  },
  {
    id: "act_42",
    leadId: "lead_25",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-06-16T14:30:00Z"
  },
  {
    id: "act_43",
    leadId: "lead_26",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Sarah Connor",
    date: "2026-05-19T14:30:00Z"
  },
  {
    id: "act_44",
    leadId: "lead_27",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "John Doe",
    date: "2026-05-18T14:30:00Z"
  },
  {
    id: "act_45",
    leadId: "lead_27",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "John Doe",
    date: "2026-05-16T14:30:00Z"
  },
  {
    id: "act_46",
    leadId: "lead_28",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "John Doe",
    date: "2026-06-15T14:30:00Z"
  },
  {
    id: "act_47",
    leadId: "lead_28",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "John Doe",
    date: "2026-06-13T14:30:00Z"
  },
  {
    id: "act_48",
    leadId: "lead_29",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Alex Mercer",
    date: "2026-05-18T14:30:00Z"
  },
  {
    id: "act_49",
    leadId: "lead_29",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Sarah Connor",
    date: "2026-05-19T14:30:00Z"
  },
  {
    id: "act_50",
    leadId: "lead_30",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Alex Mercer",
    date: "2026-06-13T14:30:00Z"
  },
  {
    id: "act_51",
    leadId: "lead_31",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Sarah Connor",
    date: "2026-05-11T14:30:00Z"
  },
  {
    id: "act_52",
    leadId: "lead_32",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Sarah Connor",
    date: "2026-06-15T14:30:00Z"
  },
  {
    id: "act_53",
    leadId: "lead_32",
    type: "Follow Up Set",
    content: "Scheduled a follow-up call for next week.",
    author: "Sarah Connor",
    date: "2026-06-15T14:30:00Z"
  },
  {
    id: "act_54",
    leadId: "lead_33",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Sarah Connor",
    date: "2026-05-15T14:30:00Z"
  },
  {
    id: "act_55",
    leadId: "lead_34",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "Alex Mercer",
    date: "2026-06-14T14:30:00Z"
  },
  {
    id: "act_56",
    leadId: "lead_35",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "John Doe",
    date: "2026-06-13T14:30:00Z"
  },
  {
    id: "act_57",
    leadId: "lead_36",
    type: "Email Sent",
    content: "Sent introductory email with service brochure.",
    author: "Alex Mercer",
    date: "2026-05-17T14:30:00Z"
  },
  {
    id: "act_58",
    leadId: "lead_36",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Alex Mercer",
    date: "2026-05-16T14:30:00Z"
  },
  {
    id: "act_59",
    leadId: "lead_37",
    type: "Status Update",
    content: "Updated lead status to follow up required.",
    author: "John Doe",
    date: "2026-05-18T14:30:00Z"
  },
  {
    id: "act_60",
    leadId: "lead_37",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "Sarah Connor",
    date: "2026-05-15T14:30:00Z"
  },
  {
    id: "act_61",
    leadId: "lead_38",
    type: "Note Added",
    content: "Added some context regarding the client's availability and preferences.",
    author: "Alex Mercer",
    date: "2026-06-12T14:30:00Z"
  },
  {
    id: "act_62",
    leadId: "lead_38",
    type: "Call Made",
    content: "Called the client but no answer. Left a voicemail.",
    author: "John Doe",
    date: "2026-05-12T14:30:00Z"
  }
];

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
