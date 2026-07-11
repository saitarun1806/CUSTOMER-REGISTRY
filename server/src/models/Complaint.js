import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
    {
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedAgent:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        title:{
            type: String,
            required: true,
            trim: true,
        },
        type:{
            type: String,
            enum: ['Complaint', 'Inquiry','Billing', 'Technical', 'General', 'Other'],
            required: true,
            trim: true,
        },
        description:{
            type: String,
            required: true,
            trim: true,
        },
        status:{
            type: String,
            enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
            default: 'Open',
        },
        isEscalated: {
            type: Boolean,
            default: false,
        },
        escalationReason: {
            type: String,
            default: '', 
        },
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;