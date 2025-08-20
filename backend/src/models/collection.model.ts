import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  description: string;
  createdBy: Types.ObjectId; // single user reference
  requests: Types.ObjectId[]; // references to Requests, empty for now
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requests: [{ type: Schema.Types.ObjectId, ref: 'Request', default: [] }],
}, {
  timestamps: true
});

const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);
export default Collection;
