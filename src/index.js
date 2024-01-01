import dotenv from "dotenv";
import { app } from "./app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

dotenv.config({
  path: "./env",
});

async function connectDB(){ 
  await prisma.$connect()
}

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed !!! ", err);
  });
