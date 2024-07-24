import mongoose from "mongoose";
type connectionObject={isConnected?:number}
const connection :connectionObject ={}
async function dbConnect():Promise<void>{
 if (connection.isConnected)
    {console.log("Already Connected With DataBase!");
    return
    }
   
    try {
       const DB = await mongoose.connect(process.env.MONGODB_URI || '',{})
       console.log("Database")
       connection.isConnected = DB.connections[0].readyState
       console.log("DB connected Sucessfully");
       
    } catch (error:any) {
        console.log("DataBase connection Failed",error);
        process.exit(1)
    }
}
export default dbConnect;