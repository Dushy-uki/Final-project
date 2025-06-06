import User from '../models/user.js';

// Create a new user (or any other item)
export const createUser = async (req, res) => {
  const { name, email, password  } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};


