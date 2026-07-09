import moongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        complaintId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true,
            unique: true,
        },
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating:{
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comments:{
            type: String,
            trim: true,
            default: "",
        }     
    },{
        timestamps: true,
    }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;