import { useState, useRef, useEffect } from "react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { Send, Video, Paperclip, Smile, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Chat() {
  const [match, params] = useRoute("/chat/:id");
  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversation,
    sendMessage,
    fetchConversations,
    loading,
    connected,
  } = useChatStore();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      void fetchConversations(user.id);
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    if (match && params?.id) {
      setActiveConversation(params.id);
    } else if (conversations.length > 0 && !activeConversationId) {
      setActiveConversation(conversations[0].id);
    }
  }, [match, params?.id, conversations, activeConversationId, setActiveConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeConversationId]);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMsgs = activeConversationId ? messages[activeConversationId] || [] : [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeConversationId) return;
    await sendMessage(activeConversationId, text);
    setText("");
  };

  const shareMeetLink = async () => {
    if (!activeConversationId) return;
    await sendMessage(activeConversationId, "https://meet.google.com/new-swap-link", "meet-link");
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100dvh-6rem)] animate-in fade-in duration-300">
      <Card className="h-full flex overflow-hidden border shadow-sm">
        <div className="w-full md:w-80 border-r flex flex-col bg-muted/10 hidden sm:flex">
          <div className="p-4 border-b bg-background">
            <h2 className="font-semibold text-lg">Messages</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {connected ? "Realtime connected" : "Connecting..."}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <p className="p-4 text-sm text-muted-foreground">Loading conversations...</p>
            )}
            {conversations.map((conv) => (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <div
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 flex items-start gap-3 ${
                    activeConversationId === conv.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className={conv.participant.avatarColor}>
                      <AvatarFallback className="text-white bg-transparent">
                        {conv.participant.initials}
                      </AvatarFallback>
                    </Avatar>
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm">{conv.participant.name}</h4>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(conv.lastAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs truncate text-muted-foreground">{conv.lastMessage}</p>
                  </div>
                </div>
              </Link>
            ))}
            {!loading && conversations.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No conversations yet. Start chatting from a match or swap request.
              </p>
            )}
          </div>
        </div>

        {activeConv ? (
          <div className="flex-1 flex flex-col bg-background relative">
            <div className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <Avatar className={activeConv.participant.avatarColor}>
                  <AvatarFallback className="text-white bg-transparent">
                    {activeConv.participant.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{activeConv.participant.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {activeConv.isOnline ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Online now
                      </>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={shareMeetLink} className="hidden sm:flex">
                <Video className="w-4 h-4 mr-2 text-primary" /> Share Meet Link
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
              {activeMsgs.map((msg, index) => {
                const isMe = msg.senderId === user.id;
                const showAvatar =
                  index === 0 || activeMsgs[index - 1].senderId !== msg.senderId;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    {showAvatar ? (
                      <Avatar
                        className={`w-8 h-8 shrink-0 ${
                          isMe ? user.avatarColor : activeConv.participant.avatarColor
                        }`}
                      >
                        <AvatarFallback className="text-white text-xs bg-transparent">
                          {isMe ? user.initials : activeConv.participant.initials}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8 shrink-0"></div>
                    )}

                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {msg.type === "text" ? (
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted/50 border rounded-tl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ) : (
                        <div
                          className={`p-4 rounded-2xl border ${
                            isMe
                              ? "bg-primary/5 border-primary/20 rounded-tr-sm"
                              : "bg-muted border-border rounded-tl-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                              <Video className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">Google Meet Session</h5>
                              <p className="text-xs text-muted-foreground">
                                Click to join the video call
                              </p>
                            </div>
                          </div>
                          <a
                            href={msg.text}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:underline text-xs block mb-3 truncate max-w-[200px]"
                          >
                            {msg.text}
                          </a>
                          <Button size="sm" className="w-full">
                            Join Call
                          </Button>
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-background border-t">
              <form onSubmit={handleSend} className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground shrink-0 hidden sm:flex"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="pr-10 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 text-muted-foreground"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={shareMeetLink}
                  className="sm:hidden shrink-0"
                >
                  <Video className="w-5 h-5 text-primary" />
                </Button>
                <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!text.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/5">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-foreground mb-2">Your Messages</h3>
            <p>Select a conversation from the sidebar or start a new chat with a match.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
