const { User, Thought } = require("../models");
const thoughtController = {
    async getThoughts(req, res) {
        Thought.find()
            .then(data => {
                return res.status(200).json(data);
            }) // end of then
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            }) //end of catch
    }, // end of getThoughts

    async getThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then(thought => {
                if (!thought) {
                    return res.status(404).json({ message: "No thought with that Id" });
                }
                return res.status(200).json(thought);
            }) //end of then
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            }) // end of catch
    }, // end of getThought

    async createThought(req, res) {
        /*
            {
                "thoughtText": "here's a thought",
                "username": "Carmen",
                "userId": "5edff358a0fcb79aa7b118b"
            }
        */
        try {
            const thought = await Thought.create(req.body);

            const user = await User.findByIdAndUpdate(
                req.body.userId,
                { $addToSet: { thoughts: thought._id }},
                {runValidators: true, new: true},
            );
            return res.status(200).json({thought, user});
        } catch (err) { //end of try
            console.log(err);
            return res.status(400).json(err);
        } //end of catch
    }, //end of createThought

    async updateThought (req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true,}
        ).then(thought => {
            if(!thought){
                return res.status(404).json({message: "no thought with this id"});
            }
            return res.status(200).json(thought);
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json(err);
        })
    },

    async deleteThought(req, res){
        Thought.findOneAndDelete(
            {_id: req.params.thoughtId},
        ).then(thought => {
            if(!thought){
                return res.status(404).json({ message: "No thought with that Id" });
            }
            return res.status(200).json({ message: "Thought and associated reactions successfully deleted" });
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json(err);
        });
    },

    async addReaction(req, res){
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true},
        ).then(thought => {
            if(!thought){
                return res.status(404).json({ message: "No thought with that Id"});
            }
            return res.status(200).json(thought);
        })
        .catch(err => {
            console.log(err);
            return res.status (400).json(err);
        })
    },

    async deleteReaction(req, res){
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {_id: req.params.reactionId}}},
            {runValidators: true, new: true,},
        )
        .then(thought => {
            if(!thought) {
                return res.status(404).json({ message: "Check thought and reactioins Ids" });
            } return res.status(200).json(thought);
        })
        .catch(err => {
            console.log(err);
            return res.status (400).json(err);
        });
    },
}

module.exports = thoughtController;