import mongoose from "mongoose";

const partsSchema = new mongoose.Schema({text: {
  type: String,
  required: true
}},{_id: false});

const historySchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "model"],
    required: true,
  },
  parts: [partsSchema],
},{_id: false});
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  history: [historySchema],
});

export default mongoose.model("User", userSchema);