import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setNewChat, setPrompt, setReply, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");  
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());   
        setPrevChats([]);            
    };

    const changeThread = async (newthreadId) => {
        setCurrThreadId(newthreadId);
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
            const res = await response.json();   
            setPrevChats(res);
            setNewChat(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="h-screen w-64 bg-[#171717] text-[#b4b4b4] flex flex-col p-4">
            
            <button
                onClick={createNewChat}
                className="h-9 flex justify-between items-center border border-gray-600 rounded-lg p-3 hover:bg-[rgba(180,180,180,0.05)] cursor-pointer"
            >
                <span className="font-bold">SigmaGPT</span>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>

            
            <div className="flex-1 mt-15">
                <p>Recents</p>
                <ul className="text-left flex flex-col">
                    {
                        allThreads?.map((thread, idx) => (
                            <li
                                key={thread.threadId}
                                className={`group relative cursor-pointer rounded-lg p-2 pr-8 text-sm truncate transition-colors
                                    ${thread.threadId === currThreadId
                                        ? "bg-[rgba(180,180,180,0.15)] text-white"
                                        : "hover:bg-[rgba(180,180,180,0.05)] text-[#b4b4b4]"
                                    }`}
                                onClick={() => changeThread(thread.threadId)}
                            >
                                {thread.title}
                                <i
                                    className="fa-solid fa-trash absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))
                    }
                </ul>
            </div>

            
            <div>
                <p>~By Anish Pandey &hearts;</p>
            </div>

        </section>
    );
}

export default Sidebar;
