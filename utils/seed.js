// Imports
const { User, Thought, Reaction } = require("../models");
const mongoose = require("mongoose");

const connection = require("../config/connection");

// Seed data
const users = [
  {
    username: "Crystal",
    email: "example@gmail.com",
    thought: [],
  },
  {
    username: "Carmen",
    email: "example@yahoo.com",
    thought: [],
  },
];

// Connects to server
connection.once("open", async () => {
  console.log("connected");

  // Drop existing students
  await User.deleteMany({});

  // Adds seed data to database
  await User.collection.insertMany(users);
//   let count = await User.count();
//   console.log(count);

  const thoughts = [];
  const usersdb = await User.find();
  usersdb.forEach(u => {
    thoughts.push({
      thoughtText: `Thought 1 for ${u.username}`,
      username: u.username
    });
    thoughts.push({
      thoughtText: `Thought 2 for ${u.username}`,
      username: u.username
    });
  });

  await Thought.deleteMany();
  await Thought.collection.insertMany(thoughts);
    
  const thoughtsdb = await Thought.find();
  thoughtsdb.forEach(t => {
    usersdb.forEach(u => {
      Thought.findOneAndUpdate(
        { _id: t.thoughtId },
        { $addToSet: { reactions: {
          reactionBody: `Reaction from ${u.username} for ${t.username}'s thought`,
          username: t.username
        } } },
        { runValidators: true }
      );
    });
  });

  console.table(users);
  console.info("Seeding complete!");
  process.exit(0);
});