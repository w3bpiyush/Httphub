import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt.util';

const SALT_ROUNDS = 10;

// Registration handler
export async function register(req: Request, res: Response) {
  try {
    const { name, orgName, password } = req.body;
    if (!name || !orgName || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user with same name and org exists (for simplicity)
    const existingUser = await User.findOne({ name, orgName });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const user = new User({ name, orgName, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id.toString());
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        orgName: user.orgName,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Login handler
export async function login(req: Request, res: Response) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const user = await User.findOne({
      $or: [{ name }, { orgName: name }]
    }); 

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id.toString());
    res.status(201).json({ 
      message: 'User login successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        orgName: user.orgName,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Edit Profile handler
export async function editProfile(req: Request, res: Response) {
  try {
    const { id, name, orgName, password } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (orgName) user.orgName = orgName;

    if (password) {
      user.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await user.save();

    // Generate a new token with updated profile
    const token = generateToken(user._id.toString());

    res.status(200).json({
      message: 'Profile updated successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        orgName: user.orgName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Edit Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}