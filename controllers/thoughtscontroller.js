const { Thoughts, User } = require('../models');

module.exports = {

    // GET all thoughts including reactionCount
    getThoughts(req, res) {
        Thought.find()
        .then(async (thoughts) => {
            const thoughtObj = {
            thoughts,
            };
            return res.json(thoughtObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // GET individual thought
    getIndividualThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'There is no thought with that ID.' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // POST new thought to create new thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: {thoughts: thought._id }},
                { runValidators: true, new: true }
            )
            .then((user) =>
                !user
                ? res.status(404).json({ message: 'There is no user with that ID.' })
                : res.json({ thought })
        )
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },  
    
    // PUT thought to update thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'There is no thought with that ID.' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE thought and remove thought from user associated with it
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'There is no thought with that ID.' })
            : User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            )
        )
        .then((user) =>
            !user
            ? res.status(404).json({
                message: 'Thought has been deleted.',
            })
            : res.json({ message: 'Thought deleted.' })
        )
        .catch((err) => res.status(500).json(err));
    },

    // POST reaction to add reaction to thought
    addReaction(req, res) {
        console.log('You are adding a reaction.');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res
                .status(404)
                .json({ message: 'There is no thought with that ID.' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE reaction to delete reaction from thought
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'There is no thought with that ID.' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};