import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import token from "@/constants/token";
import urls from "@/constants/urls";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Chat {
  id: number;
  title: string;
}

const Sidebar: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Chat[]>(urls.chatList, {
          headers: { Authorization: `token ${token}` },
        });
        setChats(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const startNewChat = async () => {
    navigate(`/chat/new`);
  };

  return (
    <ScrollArea className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      <Button className="mt-4 w-full" onClick={startNewChat}>
        New Chat
      </Button>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2 mt-4">
          {chats?.map((chat) => (
            <li key={chat.id}>
              <Link
                to={`/chat/${chat.id}`}
                className="block hover:bg-gray-700 p-2 rounded"
              >
                {chat.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ScrollArea>
  );
};

export default Sidebar;
