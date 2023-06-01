import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true, set: hashPass },
    avatar: String,
    name: String,
    age: String,
    phone_number: String,
    address: String
}, {
    collection: 'user',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

function hashPass(val: string): string {
    return bcrypt.hashSync(val, 10);
}