const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female", "other"],
		},
		role: {
			type: String,
			required: true,
			enum: ["student", "teacher", "other"],
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		followings: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		profilePic: {
			id: String,
			url: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
