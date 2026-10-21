import { MyContext } from "./MyContext";
import { useContext, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats } = useContext(MyContext);
  const bottomRef = useRef(null);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats]);

  
  if (newChat && prevChats.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
        <h1 className="text-2xl font-semibold text-white">How can I help you today?</h1>
        <p className="text-gray-500 text-sm">Start typing below to begin a conversation.</p>
      </div>
    );
  }

  return (
    
    <div className="flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto w-full">

      {prevChats.map((chat, idx) =>
        chat.role === "user" ? (

          
          <div key={idx} className="flex justify-end">
            <p className="bg-[#303030] text-white text-sm px-4 py-3 rounded-2xl rounded-br-none max-w-[75%] leading-relaxed whitespace-pre-wrap">
              {chat.content}
            </p>
          </div>

        ) : (

          
          <div key={idx} className="flex justify-start">
            <div className="flex-1 text-[#ececec] text-sm leading-relaxed prose-custom overflow-hidden">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            </div>
          </div>

        )
      )}

      
      <div ref={bottomRef} />
    </div>
  );
}

export default Chat;
