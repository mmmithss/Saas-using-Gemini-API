import { NextFunction, Request, Response } from "express";
import { createChat } from "../config/google-generative-ai-config.js";
import User from "../models/User.js";


 
 async function mainStream(userId: string, message: string, res: Response) {

  
  let chat : any;
  if(!chat){    
    const user = await User.findById(userId).select("history -_id").lean();
    console.log(user);
    const history = user.history;
    console.log(history);
    chat = await createChat(history);
  }

  // append message to db make it a transaction 
  const response = await chat.sendMessageStream({ message });
  await User.updateOne({ _id: userId }, { $push: { history: { role: "user", parts: [{ text: message }] } } },{new:true});

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";
  for await (const chunk of response) {
    if (chunk.text) {
      fullResponse += chunk.text;
      res.write(chunk.text);
    }
  }
  console.log(fullResponse);
  //append full response to db
  await User.updateOne({ _id: userId }, { $push: { history: { role: "model", parts: [{ text: fullResponse }] } } });
  res.end();
}

export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
   const { message } = req.body;
   const user = res.locals.user;
   const userId = user._id.toString();
  

  return mainStream(userId,message.toString(), res);

}

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const userId = res.locals.jwtData.id;
    const user = await User.findById(userId).select("history -_id").lean();
    if(!user){
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    return res.status(200).json({ message: "OK", history: user.history });

  }catch(error){
    console.log(error);
    return res.status(500).json({error: "Internal Server Error"});

  }
  
}

export const deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.jwtData.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { history: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }

    return res.status(200).json({ message: "OK", history: user.history });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
