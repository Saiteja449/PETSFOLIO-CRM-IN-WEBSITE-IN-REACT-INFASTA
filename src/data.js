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

export const stages = {
  Grooming: [
    "New Lead",
    "Inquiry",
    "Appointment Scheduled",
    "Grooming Completed",
    "Repeat Booking",
  ],
  Training: [
    "New Lead",
    "Consultation",
    "Assessment",
    "Package Discussion",
    "Enrollment",
    "Training Active",
    "Renewal",
  ],
  Walking: ["Lead", "Trial Walk", "Subscription", "Active Customer", "Renewal"],
  "Pet Sitting": [
    "Lead",
    "Requirement Discussion",
    "Booking Planned",
    "Service Scheduled",
    "Service Completed",
    "Repeat Booking",
  ],
  "Pet Insurance": [
    "Lead",
    "Quote Shared",
    "Documentation",
    "Comparison",
    "Payment",
    "Policy Issued",
    "Renewal",
  ],
};

// Generate 32 Realistic Dummy Leads
export const initialLeads = [
  {
    id: "lead_1",
    name: "John Doe",
    phone: "9876543210",
    email: "john.doe@gmail.com",
    source: "Meta Ads",
    service: "Grooming",
    stage: "New Lead",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-05-26",
    status: "Follow Up",
    leadType: "Client",
    providerService: "",
    
    
    
    notes:
      "Requires hypoallergenic shampoo. Slightly nervous during nail trimming.",
    createdAt: "2026-05-20",
    city: "Phoenix",
    preferredContactMethod: "Email",
    
    
  },
  {
    id: "lead_2",
    name: "Alice Smith",
    phone: "9812345678",
    email: "alice.smith@yahoo.com",
    source: "WhatsApp",
    service: "Grooming",
    stage: "Inquiry",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-27",
    status: "Joined",
    leadType: "Client",
    providerService: "Grooming",
    
    
    
    notes: "Inquired about full haircut and de-tangling treatment.",
    createdAt: "2026-05-21",
    city: "Dallas",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_3",
    name: "Robert Johnson",
    phone: "8899776655",
    email: "robert.j@outlook.com",
    source: "Meta Ads",
    service: "Grooming",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-26",
    status: "Price Issue",
    leadType: "Client",
    providerService: "",
    
    
    
    notes: "Appointment set for Saturday morning. Needs deshedding treatment.",
    createdAt: "2026-05-18",
    city: "San Jose",
    preferredContactMethod: "Email",
    
    
  },
  {
    id: "lead_4",
    name: "Emily Brown",
    phone: "7766554433",
    email: "emily.b@hotmail.com",
    source: "Meta Ads",
    service: "Grooming",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-06-15",
    status: "Joined",
    leadType: "Client",
    providerService: "",
    
    
    
    notes:
      "Super friendly. Loved the teddy bear cut. Will need a recall for repeat booking in 3 weeks.",
    createdAt: "2026-05-15",
    city: "Chicago",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_5",
    name: "Michael Davis",
    phone: "6655432110",
    email: "mdavis@corpnet.com",
    source: "Email",
    service: "Grooming",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-28",
    status: "Joined",
    leadType: "Client",
    providerService: "Walking",
    
    
    
    notes: "Monthly regular grooming customer.",
    createdAt: "2026-04-10",
    city: "San Antonio",
    preferredContactMethod: "Email",
    
    
  },
  {
    id: "lead_6",
    name: "Jessica Wilson",
    phone: "9988776655",
    email: "jess.wilson@me.com",
    source: "WhatsApp",
    service: "Training",
    assignedTo: "David Miller",
    joinedAt: "2026-05-26",
    status: "Joined",
    leadType: "Client",
    providerService: "Training",
    
    
    
    notes: "Owner is struggling with potty training and basic crate training.",
    createdAt: "2026-05-25",
    city: "Chicago",
    preferredContactMethod: "Phone",
    
    
  },
  {
    id: "lead_7",
    name: "Matthew Martinez",
    phone: "8877665544",
    email: "mmartinez@gmail.com",
    source: "Meta Ads",
    service: "Training",
    assignedTo: "David Miller",
    joinedAt: "2026-05-25", // Overdue for today's followups helper
    status: "Follow Up",
    
    
    
    notes:
      "High energy level, pulls excessively on leash. Consultation scheduled to align objectives.",
    createdAt: "2026-05-19",
    city: "Chicago",
    preferredContactMethod: "Phone",
    
    
  },
  {
    id: "lead_8",
    name: "Amanda Thomas",
    phone: "7788990011",
    email: "amanda.t@yahoo.com",
    source: "Email",
    service: "Training",
    assignedTo: "David Miller",
    joinedAt: "2026-05-29",
    status: "Follow Up",
    
    
    
    notes:
      "Completed basic initial assessment. Treats motivated but easily distracted.",
    createdAt: "2026-05-16",
    city: "Philadelphia",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_9",
    name: "James Taylor",
    phone: "9911223344",
    email: "jtaylor@outlook.com",
    source: "Meta Ads",
    service: "Training",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-05-27",
    status: "Follow Up",
    
    
    
    notes:
      "Discussing the 6-week behavior modification package. Hesitant on pricing.",
    createdAt: "2026-05-14",
    city: "San Jose",
    preferredContactMethod: "Phone",
    
    
  },
  {
    id: "lead_10",
    name: "Sarah Jenkins",
    phone: "8822334455",
    email: "sjenkins@gmail.com",
    source: "WhatsApp",
    service: "Training",
    assignedTo: "David Miller",
    joinedAt: "2026-05-30",
    status: "Follow Up",
    
    
    
    notes:
      "Enrolled in puppy socialization classes. Payment structure finalized.",
    createdAt: "2026-05-12",
    city: "New York",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_11",
    name: "David White",
    phone: "7733445566",
    email: "dwhite@hotmail.com",
    source: "Email",
    service: "Training",
    assignedTo: "David Miller",
    joinedAt: "2026-05-26",
    status: "Active",
    
    
    
    notes: "Active in Group Canine Good Citizen course. Making fast progress.",
    createdAt: "2026-05-01",
    city: "Houston",
    preferredContactMethod: "Email",
    
    
  },
  {
    id: "lead_12",
    name: "Lisa Harris",
    phone: "6644556677",
    email: "lharris@gmail.com",
    source: "Email",
    service: "Training",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-05-28",
    status: "Active",
    
    
    
    notes:
      "Agility stage 1 completed. Offering 15% discount for Agility Stage 2 renewal.",
    createdAt: "2026-03-15",
    city: "San Diego",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_13",
    name: "Kevin Martin",
    phone: "9955667788",
    email: "kmartin@yahoo.com",
    source: "Meta Ads",
    service: "Walking",
    assignedTo: "David Miller",
    joinedAt: "2026-05-26",
    status: "Active",
    
    
    
    notes:
      "Needs 30-minute slow paced daily walks due to breathing characteristics.",
    createdAt: "2026-05-24",
    city: "Dallas",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_14",
    name: "Rachel Clark",
    phone: "8866778899",
    email: "rclark@me.com",
    source: "Meta Ads",
    service: "Walking",
    assignedTo: "David Miller",
    joinedAt: "2026-05-27",
    status: "Active",
    
    
    
    notes:
      "Trial walk scheduled for tomorrow afternoon. Reactive to large dogs.",
    createdAt: "2026-05-22",
    city: "Chicago",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_15",
    name: "Brian Rodriguez",
    phone: "7777888899",
    email: "brodriguez@gmail.com",
    source: "WhatsApp",
    service: "Walking",
    assignedTo: "David Miller",
    joinedAt: "2026-05-28",
    status: "Active",
    
    
    
    notes: "Enrolling in Mon-Wed-Fri walker subscription package.",
    createdAt: "2026-05-18",
    city: "Dallas",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_16",
    name: "Megan Lewis",
    phone: "8888999900",
    email: "mlewis@corp.com",
    source: "Meta Ads",
    service: "Walking",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-06-01",
    status: "Active",
    
    
    
    notes:
      "Regular 5-day / week energetic walker customer. Handled by Walker Sam.",
    createdAt: "2026-04-05",
    city: "San Antonio",
    preferredContactMethod: "Phone",
    
    
  },
  {
    id: "lead_17",
    name: "Steven Walker",
    phone: "9999000011",
    email: "swalker@outlook.com",
    source: "Meta Ads",
    service: "Walking",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-05-24", // Overdue
    status: "Active",
    
    
    
    notes:
      "Monthly subscription ending on May 28. Needs review for renewal discount.",
    createdAt: "2026-04-20",
    city: "Chicago",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_18",
    name: "Laura Hall",
    phone: "7788001122",
    email: "lhall@gmail.com",
    source: "Email",
    service: "Pet Sitting",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-26",
    status: "Active",
    
    
    
    notes:
      "Needs feeding and litter cleaning twice daily from June 10 to June 15.",
    createdAt: "2026-05-24",
    city: "Los Angeles",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_19",
    name: "Daniel Allen",
    phone: "8899112233",
    email: "dallen@company.org",
    source: "Meta Ads",
    service: "Pet Sitting",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-27",
    status: "Active",
    
    
    
    notes:
      "Requires administration of insulin shots in the evening. Discussing safety criteria.",
    createdAt: "2026-05-21",
    city: "San Antonio",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_20",
    name: "Ashley Young",
    phone: "6677112233",
    email: "ayoung@gmail.com",
    source: "WhatsApp",
    service: "Pet Sitting",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-05-28",
    status: "Active",
    
    
    
    notes:
      "Overnight house sitting planned for 4 nights during 4th of July week.",
    createdAt: "2026-05-18",
    city: "Dallas",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_21",
    name: "Joseph King",
    phone: "9911559922",
    email: "jking@yahoo.com",
    source: "Meta Ads",
    service: "Pet Sitting",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-26",
    status: "Active",
    
    
    
    notes:
      "Scheduled block of 3 days. Keys collected and home orientation done.",
    createdAt: "2026-05-10",
    city: "Philadelphia",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_22",
    name: "Katelyn Wright",
    phone: "8822660011",
    email: "kwright@outlook.com",
    source: "Meta Ads",
    service: "Pet Sitting",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-06-05",
    status: "Active",
    
    
    
    notes: "Pet sitting successfully completed. Owner left 5-star review.",
    createdAt: "2026-05-05",
    city: "Chicago",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_23",
    name: "William Scott",
    phone: "7733551122",
    email: "wscott@yahoo.com",
    source: "Email",
    service: "Pet Sitting",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-05-28",
    status: "Active",
    
    
    
    notes: "Regular vacation sitter. Booking again for mid-June weekend.",
    createdAt: "2026-04-12",
    city: "Dallas",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_24",
    name: "Elizabeth Green",
    phone: "9944772211",
    email: "egreen@gmail.com",
    source: "Meta Ads",
    service: "Pet Insurance",
    assignedTo: "Emily Davis",
    joinedAt: "2026-05-26",
    status: "Active",
    
    
    
    notes:
      "Young kitten, owner wants to lock in a premium coverage starting early.",
    createdAt: "2026-05-24",
    city: "Philadelphia",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_25",
    name: "Thomas Baker",
    phone: "8855883344",
    email: "tbaker@comcast.net",
    source: "Email",
    service: "Pet Insurance",
    assignedTo: "Emily Davis",
    joinedAt: "2026-05-27",
    status: "Active",
    
    
    
    notes:
      "Shared quote for $5,000 annual coverage with $250 deductible. Waiting for response.",
    createdAt: "2026-05-19",
    city: "Philadelphia",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_26",
    name: "Charles Adams",
    phone: "7766991100",
    email: "cadams@gmail.com",
    source: "WhatsApp",
    service: "Pet Insurance",
    assignedTo: "Emily Davis",
    joinedAt: "2026-05-26",
    status: "Active",
    
    
    
    notes:
      "Owner uploading medical history documents to check for pre-existing conditions exclusions.",
    createdAt: "2026-05-14",
    city: "Dallas",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_27",
    name: "Patricia Nelson",
    phone: "9900334466",
    email: "pnelson@me.com",
    source: "Meta Ads",
    service: "Pet Insurance",
    assignedTo: "Emily Davis",
    joinedAt: "2026-05-28",
    status: "Active",
    
    
    
    notes:
      "Comparing our comprehensive premium cover against competitor's base-tier budget plan.",
    createdAt: "2026-05-15",
    city: "Chicago",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_28",
    name: "George Carter",
    phone: "8844885522",
    email: "gcarter@yahoo.com",
    source: "Meta Ads",
    service: "Pet Insurance",
    assignedTo: "Alex Mercer",
    joinedAt: "2026-05-26",
    status: "Active",
    
    
    
    notes:
      "Approved proposal. Sent secure payment link. Waiting for transaction execution.",
    createdAt: "2026-05-10",
    city: "San Diego",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_29",
    name: "Donna Mitchell",
    phone: "7755998811",
    email: "dmitchell@live.com",
    source: "Email",
    service: "Pet Insurance",
    assignedTo: "Emily Davis",
    joinedAt: "2026-11-26",
    status: "Closed Won",
    
    
    
    notes: "Policy PI-99238 issued. Customer onboarding packet dispatched.",
    createdAt: "2026-05-05",
    city: "Phoenix",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_30",
    name: "Kenneth Perez",
    phone: "9900228833",
    email: "kperez@gmail.com",
    source: "Email",
    service: "Pet Insurance",
    assignedTo: "Emily Davis",
    joinedAt: "2026-05-20", // Overdue renewal
    status: "Active",
    
    
    
    notes:
      "Annual policy expiring soon on June 5th. Initiating renewal proposal with premium incentive.",
    createdAt: "2025-05-20",
    city: "Los Angeles",
    preferredContactMethod: "Email",
    
    
  },
  {
    id: "lead_31",
    name: "Carol Roberts",
    phone: "8855110033",
    email: "croberts@gmail.com",
    source: "WhatsApp",
    service: "Grooming",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-29",
    status: "Active",
    
    
    
    notes:
      "Puppy's first grooming session. Owner is very protective, requested extra caring handling.",
    createdAt: "2026-05-25",
    city: "San Antonio",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_32",
    name: "Edward Evans",
    phone: "7766110044",
    email: "eevans@yahoo.com",
    source: "Meta Ads",
    service: "Walking",
    assignedTo: "David Miller",
    joinedAt: "2026-06-02",
    status: "Closed Won",
    
    
    
    notes:
      "Highly energetic. Closed won walking service with 3 rides per week.",
    createdAt: "2026-04-18",
    city: "San Diego",
    preferredContactMethod: "WhatsApp",
    
    
  },
  {
    id: "lead_33",
    name: "Clara Hughes",
    phone: "9123456789",
    email: "clara.h@gmail.com",
    source: "Meta Ads",
    service: "Grooming",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-28",
    status: "New",
    leadType: "Client",
    providerService: "",
    
    
    
    notes: "Client needs standard breed cut for puppy.",
    createdAt: "2026-05-26",
    city: "San Diego",
    preferredContactMethod: "Phone",
    
    
  },
  {
    id: "lead_34",
    name: "Nathan Drake",
    phone: "9234567890",
    email: "drake@unmapped.com",
    source: "WhatsApp",
    service: "Training",
    assignedTo: "Sarah Connor",
    joinedAt: "2026-05-29",
    status: "Joined",
    leadType: "Client",
    providerService: "Training",
    
    
    
    notes:
      "Professional trainer applying to join the network as service partner.",
    createdAt: "2026-05-26",
    city: "Chicago",
    preferredContactMethod: "Email",
    
    
  },
  {
    id: "lead_35",
    name: "Sophie Turner",
    phone: "9345678901",
    email: "sophie.t@gmail.com",
    source: "Meta Ads",
    service: "Walking",
    assignedTo: "David Miller",
    joinedAt: "2026-05-27",
    status: "New",
    leadType: "Client",
    providerService: "",
    
    
    
    notes: "Client requesting 2 morning walks per day starting next week.",
    createdAt: "2026-05-26",
    city: "San Diego",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_36",
    name: "Marcus Vance",
    phone: "9456789012",
    email: "marcus@vancewalks.com",
    source: "Email",
    service: "Walking",
    assignedTo: "David Miller",
    joinedAt: "2026-05-28",
    status: "Joined",
    leadType: "Client",
    providerService: "Walking",
    
    
    
    notes:
      "Looking to onboard as an experienced pet walker for premium routes.",
    createdAt: "2026-05-26",
    city: "San Antonio",
    preferredContactMethod: "Phone",
    
    
  },
  {
    id: "lead_37",
    name: "Lily Evans",
    phone: "9567890123",
    email: "lily.e@hogwarts.edu",
    source: "Email",
    service: "Pet Sitting",
    assignedTo: "Emily Davis",
    joinedAt: "2026-05-30",
    status: "New",
    leadType: "Client",
    providerService: "",
    
    
    
    notes: "In-home pet parenting requested for 5 days of vacation.",
    createdAt: "2026-05-26",
    city: "Los Angeles",
    preferredContactMethod: "SMS",
    
    
  },
  {
    id: "lead_38",
    name: "Julian Assange",
    phone: "9678901234",
    email: "julian@wikipets.org",
    source: "Meta Ads",
    service: "Grooming",
    assignedTo: "Emily Davis",
    joinedAt: "2026-05-29",
    status: "Joined",
    leadType: "Client",
    providerService: "Grooming",
    
    
    
    notes: "Part-time self-employed groomer seeking subcontract shifts.",
    createdAt: "2026-05-26",
    city: "New York",
    preferredContactMethod: "WhatsApp",
    
    
  },
];

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
