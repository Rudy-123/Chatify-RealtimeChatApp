import { useAuthStore } from "../store/useAuthStore";
import { ChevronDown, Trash } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "../Components/ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);
  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {/* Case: Messages exist */}
        {messages?.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative group ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.senderId === authUser._id && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs btn-circle bg-black/20 hover:bg-black/40 border-none text-white"
                        >
                          <ChevronDown size={14} />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-slate-800 rounded-box w-24 border border-slate-700"
                        >
                          <li>
                            <button
                              onClick={() => deleteMessage(msg._id)}
                              className="text-red-500 hover:text-red-400 hover:bg-slate-700/50 flex items-center gap-2 p-2"
                            >
                              <Trash size={14} />
                              <span className="text-xs">Delete</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {/* Image Message */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}

                  {/* Text Message */}
                  {msg.text && <p className="mt-2 text-wrap break-words">{msg.text}</p>}

                  {/* Timestamp */}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          selectedUser && (
            <NoChatHistoryPlaceholder name={selectedUser.fullname} />
          )
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
