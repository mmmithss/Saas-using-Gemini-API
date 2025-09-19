import { Request, Response, Router } from "express"
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";


const appRouter = Router();

const sayHello = (req: Request, res: Response) => { return res.status(200).json({ message: "Hello World!" }); };

appRouter.get("/",sayHello);
appRouter.use("/chat",chatRoutes);
appRouter.use("/user",userRoutes);

export default appRouter;