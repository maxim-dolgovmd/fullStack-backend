import mongoose from "mongoose";

const commentShema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

    paramsId: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }

},
{
    timestamps: true
})

export default mongoose.model('Comment', commentShema)