const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    userType: {
        type: String,
        enum: ["ADMIN", "MANAGER"],
        required: true
    }
},
    { timestamps: true }
)

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model('User', UserSchema)