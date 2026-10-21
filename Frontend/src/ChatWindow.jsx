import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt, setPrompt,
    currThreadId,
    setPrevChats,
    setNewChat,
    setAllThreads,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    const userMessage = prompt.trim();
    if (!userMessage) return;

    
    setPrevChats(prev => [...prev, { role: "user", content: userMessage }]);
    setPrompt("");
    setNewChat(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, threadId: currThreadId }),
      });
      const res = await response.json();

      
      if (res.reply) {
        setPrevChats(prev => [...prev, { role: "assistant", content: res.reply }]);
      }

      
      const threadsRes = await fetch("http://localhost:8080/api/thread");
      const threads = await threadsRes.json();
      setAllThreads(threads.map(t => ({ threadId: t.threadId, title: t.title })));

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 h-screen flex flex-col overflow-hidden">

      
      <header className="shrink-0 flex justify-between items-center px-5 py-3 border-b border-gray-700 bg-[#212121]">
        <span className="font-semibold text-base flex items-center gap-2">
          SigmaGPT <i className="fa-solid fa-chevron-down text-xs text-gray-400"></i>
        </span>
        <i className="fa-solid fa-user text-gray-400 hover:text-white cursor-pointer transition-colors"></i>
      </header>

      
      <div className="flex-1 overflow-y-auto">
        <Chat />
      </div>

      
      {loading && (
        <div className="shrink-0 flex justify-center py-2">
          <ScaleLoader color="#9ca3af" height={16} />
        </div>
      )}

      
      <div className="shrink-0 px-4 pb-5 pt-2 bg-[#212121]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-[#303030] rounded-2xl px-4 py-3">
            <input
              type="text"
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && getReply()}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
            />
            <button
              onClick={getReply}
              disabled={loading}
              className="text-gray-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            SigmaGPT can make mistakes. Check important information.
          </p>
        </div>
      </div>

    </div>
  );
}

export default ChatWindow;
