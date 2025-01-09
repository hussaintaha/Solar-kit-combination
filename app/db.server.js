
import mongoose from "mongoose"

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect("mongodb://localhost:27017/solar-combination");
    console.log("Database Connected");
    return connection;
  } catch (error) {
    console.log("error in database connection");
    return error;
  }
}

export default dbConnection();