import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/openai.js";

const router = express.Router();


// GET ALL THREADS
router.get("/thread", async (req, res) => {
    try {
        // Sort in MongoDB query (not in JS) for efficiency
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// GET THREAD MESSAGES BY threadId
router.get("/thread/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const thread = await Thread.findOne({ threadId: id });
        if (!thread) {
            return res.status(404).json({ error: "Chat not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
});

// DELETE THREAD BY threadId
router.delete("/thread/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedThread = await Thread.findOneAndDelete({ threadId: id });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete the thread" });
    }
});

// POST CHAT — send a message and get a reply
// Frontend sends { threadId, message } in the body
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message, timestamp: new Date() }]
            });
        } else {
            thread.messages.push({ role: "user", content: message, timestamp: new Date() });
        }

        const assistantReply = await getGeminiResponse(message);
        if (!assistantReply) {
            return res.status(502).json({ error: "AI returned an empty response" });
        }
        thread.messages.push({ role: "assistant", content: assistantReply, timestamp: new Date() });
        thread.updatedAt = new Date();

        await thread.save();
        res.status(200).json({ reply: assistantReply, threadId: thread.threadId });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});


export default router;
