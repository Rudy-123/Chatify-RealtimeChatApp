import BorderAnimatedContainer from "../Components/BorderAnimatedContainer";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../Components/ProfileHeader";
import ActiveTabSwitch from "../Components/ActiveTabSwitch";
import ChatsList from "../Components/ChatsList";
import ChatContainer from "../Components/ChatContainer";
import ContactList from "../Components/ContactList";
import NoConversationPlaceHolder from "../Components/NoConversationPlaceHolder";

export default function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[800px] flex">
      <BorderAnimatedContainer>
        <div className="flex h-full w-full">
          {/* LEFT */}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceHolder />}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
