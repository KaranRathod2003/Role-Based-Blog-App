import  dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import { app } from './app.js';
dotenv.config({
    debug : true
});
const PORT  = process.env.PORT || 5000;



app.get("/", (req, res) =>{
    res.send("Hello world")
})
connectDB()
.then(()=>{
    app.listen(PORT || 5000, ()=>{
        console.log(`SERVER IS RUNNING ${PORT || 5000}`)
    })
})
.catch((err)=>{
    console.log('MONGO DB CONNECTION FAILED' ,err);
})

