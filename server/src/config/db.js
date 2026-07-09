import moongoose from "mongoose";

const connectDB = async () => {
    mongoDbUrl=process.env.MONGO_URI;
    if(!mongoDbUrl){
        console.error("MongoDB connection string is not defined in the environment variables.");
        process.exit(1);
    }
  try {
    await mongoose.connect(mongoDbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;