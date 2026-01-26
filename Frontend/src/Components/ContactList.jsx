import { useEffect } from "react"; // ← YE ADD KARO
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function ContactList() {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    isUsersLoading,
    onlineUsers,
  } = useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map(
        (
          contact, // ← CHATS KI JAGAH allContacts
        ) => (
          <div
            key={contact._id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`avatar ${onlineUsers?.includes(contact._id) ? "online" : ""}`}
              >
                <div className="size-12 rounded-full overflow-hidden bg-slate-700">
                  <img
                    src={contact.profilePic || "/avatar.png"}
                    alt={contact.fullname || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">
                {contact.fullname || "No Name Available"}
              </h4>
            </div>
          </div>
        ),
      )}
    </>
  );
}

export default ContactList;
