const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread',
        }
    ],
    onboarded: { type: Boolean, default: false },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
        }
    ]
});

const User = mongoose.model('User', UserSchema) || mongoose.models.User;
export default User;