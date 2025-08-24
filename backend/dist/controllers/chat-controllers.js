import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
process.env.GOOGLE_API_KEY = 'AIzaSyBqg6t7pZg6zXx5X0jF7hO5Xy5b3nBf9p4';
// Initialize Google Generative AI
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not defined in environment variables');
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
};
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        // Find the user by ID
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .json({ message: 'User not registered OR Token malfunctioned' });
        }
        // Format user's chat history
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        // Start a chat session with Google Generative AI
        const chatSession = await model.startChat({
            generationConfig,
            history: [],
        });
        // Send the new message and get the response
        const result = await chatSession.sendMessage(message);
        const responseText = await result.response.text();
        // Append AI response to user's chat history
        user.chats.push({ content: message, role: 'user' });
        user.chats.push({ content: responseText, role: 'assistant' });
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.error('Error during chat session:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};
// Send Chats to User
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
// Delete Chats
export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        // user.chats = []; // Clear user's chat history
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map