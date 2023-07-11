const { Schema, model, Types } = require('mongoose');

const usersSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email'],
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Virtual for friendCount
usersSchema.virtual('friendCount').get(function() {
    return this.friends.length;
}
);
const Users = model('users', usersSchema);

module.exports = Users;
