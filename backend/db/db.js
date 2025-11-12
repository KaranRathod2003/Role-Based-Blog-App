import mongoose from "mongoose";



const DB_NAME = 'blog'
const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`);
        console.log(`Mongo DB is connected || DB Host :  ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongo DB connection Failed", error);
        throw new error;
        // process.exit(1);
    }
}


export { connectDB };