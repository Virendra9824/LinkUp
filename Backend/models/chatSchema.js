const { default: mongoose } = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    user:[{type:mongoose.Schema.Types.ObjectId , ref: "User"}],
   
    latestMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
