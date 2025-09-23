import { fileURLToPath } from "url";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import express from "express";
import path from "path";
import "dotenv/config";
import fs from "fs";
// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../../frontend/dist/index.html");
console.log("Frontend path exists:", fs.existsSync(frontendPath));
//connections and listneres
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
console.log(NODE_ENV);
if (NODE_ENV === "production") {
    console.log("production");
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../../frontend/dist/index.html")));
}
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => console.log(`Server Open and connected to Database👍 and running port: ${PORT}`));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map