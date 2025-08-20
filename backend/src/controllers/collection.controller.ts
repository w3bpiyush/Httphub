import { Request, Response } from 'express';
import Collection from '../models/collection.model';

// Add a new collection
export async function addCollection(req: Request, res: Response) {
  try {
    const { name, description, createdBy } = req.body;

    if (!name || !description || !createdBy) {
      return res.status(400).json({ message: 'Name, description and createdBy are required' });
    }

    const collection = new Collection({ name, description, createdBy, requests: [] });
    await collection.save();

    res.status(201).json({ message: 'Collection created', collection });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Rename (update name and description) of a collection by ID
export async function renameCollection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    collection.name = name;
    collection.description = description;
    await collection.save();

    res.json({ message: 'Collection updated', collection });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a collection by ID
export async function deleteCollection(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get collections created by a specific user
export async function getCollectionsByUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const collections = await Collection.find({ createdBy: userId });

    res.json({ collections });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}