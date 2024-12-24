// src/constants/urls.ts
const BASE_URL = "http://localhost:8000/api/v1/chat/";

const urls = {
  chatList: `${BASE_URL}chat-list/`,
  chat: (chatId: string) => `${BASE_URL}chats/${chatId}/messages/`,
  claude: `${BASE_URL}claude/`,
  savedSystemPrompts: `${BASE_URL}saved-system-prompts/`,
  updateSystemPrompt: (chatId: string) =>
    `${BASE_URL}chats/${chatId}/system-prompt/`,
  updateSavedSystemPrompt: (promptId: number) =>
    `${BASE_URL}saved-system-prompts/${promptId}/`,
  upload: (chatId: string) => `${BASE_URL}chats/${chatId}/upload/`,
  attachments: (chatId: string) => `${BASE_URL}chats/${chatId}/attachments/`,
  deleteAttachment: (attachmentId: string) =>
    `${BASE_URL}attachments/${attachmentId}/`,
  fileContent: (attachmentId: string) =>
    `${BASE_URL}attachments/${attachmentId}/content/`,
};

export default urls;
