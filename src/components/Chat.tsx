import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, X, Paperclip, RefreshCw } from "lucide-react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Toaster, toast } from "sonner";
import ConfigDialog from "./ConfigDialog";
import FileManager from "./FileManager";
import useChat from "../hooks/useChat";
import AttachmentSidebar from "./AttachmentSidebar";

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const {
    messages,
    newMessage,
    setNewMessage,
    isStreaming,
    error,
    attachments,
    systemPrompt,
    savedSystemPrompts,
    handleSubmit,
    handleAttachment,
    removeAttachment,
    handleSystemPromptChange,
    handleSaveSystemPrompt,
    handleUpdateSystemPrompt,
    refreshAttachments,
    isLoadingAttachments,
  } = useChat(chatId || "new");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileAttach = (fileIds: string[]) => {
    setAttachedFiles(fileIds);
    toast.success("File attached successfully");
  };

  const handleRemoveAttachedFile = (fileId: string) => {
    setAttachedFiles(attachedFiles.filter((id) => id !== fileId));
    toast.info("File removed from context");
  };

  const handleDeleteAttachment = async (fileId: string) => {
    try {
      await removeAttachment(fileId);
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, attachedFiles);
    setAttachedFiles([]);
  };

  const handleRefreshAttachments = () => {
    refreshAttachments();
    toast.info("Refreshing attachments");
  };

  return (
    <div className="w-full h-screen flex">
      <Toaster />
      <Card className="flex-grow overflow-hidden relative">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Chat</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefreshAttachments}
              disabled={isLoadingAttachments}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoadingAttachments ? "animate-spin" : ""
                }`}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsConfigDialogOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100vh-8rem)] flex flex-col">
          {/* Messages display */}
          <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-4">
            {messages.length > 0 ? (
              <>
                {messages.map((message, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Avatar>
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-100" : "bg-gray-100"
                      } max-w-[80%]`}
                    >
                      <p className="font-semibold mb-1">
                        {message.role === "user" ? "User" : "Assistant"}
                      </p>
                      {message.type === "image" ? (
                        <img
                          src={message.content}
                          alt="Uploaded content"
                          className="max-w-full h-auto"
                        />
                      ) : message.role === "user" ? (
                        <p>{message.content}</p>
                      ) : (
                        <MarkdownPreview
                          source={message.content}
                          style={{ padding: 16 }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center text-gray-500">
                No messages available. Start chatting!
              </p>
            )}
            {error && (
              <div className="text-red-500 font-bold text-center">{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Message input form */}
          <form onSubmit={handleSendMessage} className="mt-auto">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isStreaming}
              className="w-full mb-2"
              rows={3}
            />
            <div className="flex justify-between">
              <Button type="submit" disabled={isStreaming}>
                Send
              </Button>
              <FileManager
                chatId={chatId || "new"}
                onAttach={handleFileAttach}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      <AttachmentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        attachments={attachments}
        attachedFiles={attachedFiles}
        onRemoveFromContext={handleRemoveAttachedFile}
        onDelete={handleDeleteAttachment}
      />
      <ConfigDialog
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
        systemPrompt={systemPrompt}
        onSystemPromptChange={handleSystemPromptChange}
        savedSystemPrompts={savedSystemPrompts}
        onSaveSystemPrompt={handleSaveSystemPrompt}
        onUpdateSystemPrompt={handleUpdateSystemPrompt}
        onSelectSystemPrompt={(prompt) => {
          handleSystemPromptChange(prompt);
        }}
      />
    </div>
  );
};

export default Chat;
