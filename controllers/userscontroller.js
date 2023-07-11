// Requiring models
const { User, Thought } = require('../models');

module.exports = {

    // GET all users including friendCount
    getUsers(req, res) {
        User.find()
        .then(async (users) => {
            const userObj = {
            users,
            };
            return res.json(userObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // GET individual user
    getIndividualUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then(async (user) =>
            !user
            ? res.status(404).json({ message: 'There is no user with that ID.' })
            : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // POST new user to create new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    // PUT user to update user
    updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'There is no user with that ID.' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
      },

    // DELETE user and associated thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'There is no user with that ID.' })
            : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User and associated thoughts deleted.' }))
        .catch((err) => res.status(500).json(err));
    },

    // POST friend to add friend to user
    addFriend(req, res) {
        console.log('Friend Added.');
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res
                .status(404)
                .json({ message: 'There is no user with that ID.' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE friend to delete friend from user
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'There is no user with that ID.' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};