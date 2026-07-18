import { create } from 'zustand';
import { Conversation, Message, MOCK_CONVERSATIONS, MOCK_MESSAGES, CURRENT_USER } from '../mock/data';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  setActiveConversation: (id: string) => void;
  sendMessage: (convId: string, text: string, type?: "text" | "meet-link") => void;
  markAsRead: (convId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: null,
  messages: MOCK_MESSAGES,
  
  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    get().markAsRead(id);
  },
  
  sendMessage: (convId, text, type = "text") => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER.id,
      text,
      sentAt: new Date().toISOString(),
      type
    };
    
    set((state) => {
      const convMsgs = state.messages[convId] || [];
      return {
        messages: {
          ...state.messages,
          [convId]: [...convMsgs, newMsg]
        },
        conversations: state.conversations.map(c => 
          c.id === convId 
            ? { ...c, lastMessage: type === 'meet-link' ? 'Shared a Meet link' : text, lastAt: newMsg.sentAt } 
            : c
        )
      };
    });
  },
  
  markAsRead: (convId) => {
    set((state) => ({
      conversations: state.conversations.map(c => 
        c.id === convId ? { ...c, unread: 0 } : c
      )
    }));
  }
}));
