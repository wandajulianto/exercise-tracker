import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  exercises: {
    type: [{}], default: []
  }
});

export default mongoose.model("User", UsersSchema);
