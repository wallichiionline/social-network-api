const {User, Thought} = require("../models");

const userController = {
    async getUsers(req, res){
        await User.find()
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            });
    },
    // GET single user
    async getUser(req, res){
        try{
            const user = await User.findOne({ _id: req.params.userId })
            .populate({ path: "thoughts", select: "-__v" })
            .populate({ path: "friends", select: "-__v" });
        if (user){
            return res.status(404).json({ message: "No user with that ID" });
        }
        return res.status(200).json(user);
        }catch (err){
            console.log(err);
            return res.status(400).json(err);
        };
    },
    // CREATE user
    async createUser(req, res){
        /*{
            "username": "McBean",
            "email": "example@gmail.com",
            "thought": []
        }*/
        await User.create(req.body)
            .then(data => {
                return res.status(200).json(data);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            });
    },
    // UPDATE user
    async updateUser(req, res){
        try{
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$set: req.body},
                {runValidators: true, new: true},
            );
            if(!user){
                return res.stattus(404).json({ message: "No user with this id" });
            }
            return res.status(200).json(user);
        }
        catch (err){
            console.log(err);
            return res.status(400).json(err);
        }
    },
    // DELETE user
    async deleteUser(req, res){
        try{
            const user = await User.findOneAndDelete(
                {_id: req.params.userId},
            );
            if(!user){
                return res.stattus(404).json({ message: "No user with this id" });
            }
            await Thought.deleteMany({_id: {$in: user.thoughts}});
            return res.status(200).json({ message: "User and associated thoughts and reactions deleted" });
        }
        catch (err){
            console.log(err);
            return res.status(400).json(err);
        }
    },
    // ADD friend
    async addFriend(req, res){
        try{
            const friend = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$addToSet: { friends: req.params.friendId } },
                {runValidators: true, new: true}
            );
            if(!friend){
                return res.stattus(404).json({ message: "No user with this id" });
            }
            return res.status(200).json({ message: "User was added as a friend" });
        }
        catch (err){
            console.log(err);
            return res.status(400).json(err);
        }
    },
    //DELETE friend
    async addFriend(req, res){
        try{
            const friend = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$pull: { friends: req.params.friendId } },
                {runValidators: true, new: true}
            );
            if(!friend){
                return res.stattus(404).json({ message: "No user with this id" });
            }
            return res.status(200).json({ message: "User was added as a friend" });
        }
        catch (err){
            console.log(err);
            return res.status(400).json(err);
        }
    },
};

module.exports = userController;