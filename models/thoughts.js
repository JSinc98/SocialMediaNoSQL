const { Schema, model } = require('mongoose');
const reactSchema = require('./reaction');
const format = require('date-fns/format');

const thinkSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 200,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (date) => format(new Date(date), "MMMM dd, yyyy 'at' hh:mm a"),
        },
        username: {
            type: String,
            required: true,
        },
        reaction: [reactSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// Virtual for reactionCount
thinkSchema.virtual('reactionCount').get(function() {
    return this.reaction.length;
});

const Think = model('thought', thinkSchema);

module.exports = Think;