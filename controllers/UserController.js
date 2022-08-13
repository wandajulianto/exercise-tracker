import User from '../models/UserModel.js';

export const saveUser = async (req, res) => {
  try {
    const user = await User.find({username: req.body.username});

    if (user.length > 0) {
      return res.send("Username has been taken..");
    }

    const newUser = new User({
      username: req.body.username,
    });

    await newUser.save();
    res.status(201).json({username: newUser.username, _id: newUser._id});
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    const usersArray = [];
    for (let user of users) {
      usersArray.push({username: user.username, _id: user._id});
    }

    res.json(usersArray);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const saveExercise = async (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;
  const dates = date === '' || date === undefined ? new Date() : new Date(date);

  if (description === '') return res.send("Path `description` is required!");
  if (duration === '') return res.send("Path `duration` is required!");

  try {
    const user = await User.findOne({_id: userId});

    if (typeof user !== 'object') {
      return res.send("Unknown userId");
    }

    user.exercises.push({
      description: description,
      duration: Number(duration),
      date: dates.toDateString(),
    });

    await user.save();

    res.json({
      _id: userId,
      username: user.username,
      date: dates.toDateString(),
      duration: Number(duration),
      description: description,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const getLogs = async (req, res) => {
  const userId = req.params._id;
  const { limit, from, to } = req.query;

  try {
    const user = await User.findById(userId);
    const exercises = user.exercises;

    if (from) {
      exercises = exercises.filter(exercise => Date.parse(exercise.date) >= new Date(from).getTime);
    }

    if (to) {
      exercises = exercises.filter(exercise => Date.parse(exercise.date) <= new Date(to).getTime);
    }

    if (limit && Number(limit) !== NaN) {
      exercises = exercises.filter(exercise => exercises.indexOf(exercise) < limit);
    }

    return res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length(),
      log: exercises,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
