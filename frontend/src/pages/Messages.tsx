import { useState } from "react";
import { motion } from "motion/react";
import {
  Edit,
  Info,
  Phone,
  Video,
  Image as ImageIcon,
  Heart,
  Smile
} from "lucide-react";
import { MOCK_CHATS, MOCK_USER } from "../mockData";
import { cn } from "~/shared/libs/utils";

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-48px)] md:h-[calc(100vh-20px)] max-w-[935px] mx-auto md:my-2 border-x md:border border-zinc-200 md:rounded-md overflow-hidden bg-white"
    >
      {/* Sidebar */}
      <div
        className={cn(
          "w-full md:w-[350px] border-r border-zinc-200 flex flex-col",
          // On mobile, if a chat is selected (in a real app), we'd hide this.
          // For this demo, we'll just keep it simple.
        )}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="font-bold text-xl">{MOCK_USER.username}</span>
            <svg
              aria-label="Down chevron icon"
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path>
            </svg>
          </div>
          <button className="hover:text-zinc-500">
            <Edit className="w-6 h-6" />
          </button>
        </div>

        <div className="px-5 py-2 flex items-center justify-between">
          <span className="font-bold text-sm">Messages</span>
          <button className="text-zinc-500 font-semibold text-sm hover:text-zinc-400">
            Requests
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {MOCK_CHATS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-zinc-50 transition-colors",
                selectedChat.id === chat.id && "bg-zinc-50",
              )}
            >
              <img
                src={chat.user.avatar}
                className="w-14 h-14 rounded-full border border-zinc-100"
                alt=""
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm truncate",
                    chat.unreadCount > 0 ? "font-bold" : "font-normal",
                  )}
                >
                  {chat.user.username}
                </p>
                <p
                  className={cn(
                    "text-xs truncate",
                    chat.unreadCount > 0
                      ? "text-black font-semibold"
                      : "text-zinc-500",
                  )}
                >
                  {chat.lastMessage} • {chat.timestamp}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="w-2 h-2 bg-[#0095f6] rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="hidden md:flex flex-1 flex-col">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={selectedChat.user.avatar}
              className="w-8 h-8 rounded-full"
              alt=""
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-sm">
              {selectedChat.user.username}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-zinc-500">
              <Phone className="w-6 h-6" />
            </button>
            <button className="hover:text-zinc-500">
              <Video className="w-6 h-6" />
            </button>
            <button className="hover:text-zinc-500">
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 no-scrollbar">
          <div className="flex flex-col items-center py-10">
            <img
              src={selectedChat.user.avatar}
              className="w-24 h-24 rounded-full mb-4"
              alt=""
              referrerPolicy="no-referrer"
            />
            <p className="font-bold text-xl mb-1">
              {selectedChat.user.fullName}
            </p>
            <p className="text-zinc-500 text-sm mb-4">
              {selectedChat.user.username} • Instagram
            </p>
            <button className="bg-zinc-100 hover:bg-zinc-200 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              View Profile
            </button>
          </div>

          {/* Mock Messages */}
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-zinc-100 p-3 rounded-2xl text-sm">
              Hey! Did you see the new post?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-[#0095f6] text-white p-3 rounded-2xl text-sm">
              Yeah, it looks amazing!
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 border border-zinc-200 rounded-full px-4 py-2">
            <button className="hover:text-zinc-500">
              <Smile className="w-6 h-6" />
            </button>
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 outline-none text-sm"
            />
            <button className="hover:text-zinc-500">
              <ImageIcon className="w-6 h-6" />
            </button>
            <button className="hover:text-zinc-500">
              <Heart className="w-6 h-6" />
            </button>
            <button className="text-[#0095f6] font-bold text-sm hover:text-[#00376b]">
              Send
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
