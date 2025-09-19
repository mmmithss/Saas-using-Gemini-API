import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import {
  generateChatCompletion,
  getHistory,
  deleteHistory
} from "../controllers/chat-controllers.js";
import {protectRoute} from "../middleware/verifyUser.js";


//Protected API

const chatRoutes = Router();
chatRoutes.use(protectRoute);

chatRoutes.post(
  "/new",validate(chatCompletionValidator),
  generateChatCompletion
);

chatRoutes.get("/all-chats",verifyToken,getHistory);

chatRoutes.delete("/delete",verifyToken,deleteHistory);



export default chatRoutes;
