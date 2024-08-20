const {Schema, model} = require("mongoose");
const {getDate} = require("../utils/helpers.js");
const reactionSchema = require("./reaction");

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true, 
            maxlength: 280,
            minlength: 1,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: getDate,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    },
);

thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);
module.exports = Thought