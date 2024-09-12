// import { PrismaClient } from "@prisma/client";

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
// }

// export default prisma;



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