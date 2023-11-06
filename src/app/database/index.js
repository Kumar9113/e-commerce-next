import mongoose from "mongoose";
const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
//console.log(process.env.DATABASE_URL);

const connectToDB = async () => {
  const connectionUrl = "mongodb+srv://Kumar:Kumar%409113@cluster0.xrhjxpn.mongodb.net/?retryWrites=true&w=majority";

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Ecommerce database connected successfully!"))
    .catch((err) =>
      console.log(`Getting Error from DB connection ${err.message}`)
    );
};

export default connectToDB;
