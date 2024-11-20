const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
			dbName: "SocialMediaDB",
		});
		console.log("Connected to MongoDB, successfully!");
	} catch (error) {
		console.log("Error while connecting to MONGODB: ", error);
	}
};

module.exports = connectDB;
