import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userName: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String },
    isAdmin: { type: Boolean, default: false },
}, {
    timestamps: true,
});
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
//# sourceMappingURL=user.js.map