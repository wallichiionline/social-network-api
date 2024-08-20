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
};