import { Request, Response } from 'express';
import RequestModel from '../models/request.model';
import Collection from '../models/collection.model';
import mongoose from 'mongoose';

// Create a new request and add its ID to the collection's requests array
export async function createRequest(req: Request, res: Response) {
  try {
    const { collection, ...requestData } = req.body;

    if (!collection || !mongoose.Types.ObjectId.isValid(collection)) {
      return res.status(400).json({ message: 'Valid collection ID is required' });
    }

    // Create request document
    const newRequest = new RequestModel({ ...requestData, collection });
    await newRequest.save();

    // Update collection to include this request ID
    await Collection.findByIdAndUpdate(collection, { $push: { requests: newRequest._id } });

    res.status(201).json({ message: 'Request created', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update a request by ID
export async function updateRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request updated', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete a request by ID and remove its reference from the collection
export async function deleteRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    const requestToDelete = await RequestModel.findById(id);
    if (!requestToDelete) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Remove request ID from the related collection's requests array
    if (requestToDelete.collection && mongoose.Types.ObjectId.isValid(requestToDelete.collection)) {
      await Collection.findByIdAndUpdate(requestToDelete.collection, { $pull: { requests: requestToDelete._id } });
    }

    // Delete the request document
    await RequestModel.findByIdAndDelete(id);

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get a request by ID
export async function getRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    const request = await RequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get all requests for a specific collection
export async function getRequestsByCollection(req: Request, res: Response) {
  try {
    const { id: collectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({ message: 'Invalid collection ID' });
    }

    const requests = await RequestModel.find({ collection: collectionId });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
