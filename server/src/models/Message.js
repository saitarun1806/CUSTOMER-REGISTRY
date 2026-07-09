import moongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        complaintId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true,
        },
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;