export const API_BASE_URL = false
  ? "http://localhost:5000/api"
  : "https://holyminicow.com/crm-beta/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
  },
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
  },
  LEADS: {
    BASE: `${API_BASE_URL}/leads`,
  },
  ACTIVITIES: {
    BASE: `${API_BASE_URL}/activities`,
  },
  FOLLOWUPS: {
    BASE: `${API_BASE_URL}/followups`,
  },
  WHATSAPP: {
    CONNECT: `${API_BASE_URL}/whatsapp/connect`,
    STATUS: `${API_BASE_URL}/whatsapp/status`,
    LOGOUT: `${API_BASE_URL}/whatsapp/logout`,
    QR: `${API_BASE_URL}/whatsapp/qr`,
    CONVERSATIONS: `${API_BASE_URL}/whatsapp/conversations`,
    CONVERSATION: (leadId) => `${API_BASE_URL}/whatsapp/conversation/${leadId}`,
    SEND_MESSAGE: `${API_BASE_URL}/whatsapp/message/send`,
    AI_TOGGLE: `${API_BASE_URL}/whatsapp/ai/toggle`,
    KB: `${API_BASE_URL}/whatsapp/knowledge-base`,
    UPLOAD: `${API_BASE_URL}/whatsapp/upload`,
  },
  ANALYTICS: {
    BASE: `${API_BASE_URL}/analytics`,
    TODAY: `${API_BASE_URL}/analytics/today`,
    AI_LIMITS: `${API_BASE_URL}/analytics/ai-limits`,
    AI_LIMITS_REFRESH: `${API_BASE_URL}/analytics/ai-limits/refresh`,
  },
  TARGETS: {
    TEMPLATES: `${API_BASE_URL}/targets/templates`,
    TEMPLATE: (id) => `${API_BASE_URL}/targets/templates/${id}`,
    ASSIGNMENTS: `${API_BASE_URL}/targets/assignments`,
    ASSIGNMENT: (id) => `${API_BASE_URL}/targets/assignments/${id}`,
  },
};

export const BACKEND_URL = API_BASE_URL.replace(/\/api$/, "");
