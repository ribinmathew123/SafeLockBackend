
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const connectDatabase = async () => {
  try {
    const uri = await mongoose.connect(String(process.env.MONGO_DB_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\nMONGO DB CONNECTION IS SUCCESSFUL!: ${uri.connection.host}`);
  } catch (err) {
    console.log(`Database connection failed : ${err}`);

  }
};

export default  connectDatabase;
