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
		userName: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			minlength: 5,
			maxlength: 20,
			match: /^[a-zA-Z0-9._]+$/,
			lowercase: true,
			default: function () {
				const currentSecond = new Date().getSeconds();
				return `its_${this.firstName.toLowerCase()}.${currentSecond}`;
			},
		},
		bio: {
			type: String,
			default: function () {
				// Set bio based on role
				const capitalizedRole =
					this.role.charAt(0).toUpperCase() + this.role.slice(1);
				return this.role !== "other"
					? `${capitalizedRole} at JIET 🎓`
					: "Proud to be JIETian 🚩";
			},
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
			default: "student",
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
