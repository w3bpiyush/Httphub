import mongoose, { Schema, Document, Types } from 'mongoose';

export type AuthType = 'inherit' | 'noauth' | 'basic' | 'bearer' | 'oauth2' | 'apikey';
export type BodyMode = 'raw' | 'formdata';
export type RawType = 'text' | 'json' | 'javascript' | 'html' | 'xml';
export type ApiKeyIn = 'header' | 'query';

export interface IHeader {
  key: string;
  value: string;
}

export interface IQueryParam {
  key: string;
  value: string;
}

export interface IFormData {
  key: string;
  value: string;
  type: 'text' | 'file';
}

export interface IAuth {
  type: AuthType;
  basic?: {
    username: string;
    password: string;
  };
  bearer?: {
    token: string;
  };
  oauth2?: {
    token: string;
  };
  apiKey?: {
    key: string;
    value: string;
    in?: ApiKeyIn;
  };
}

export interface IBody {
  mode: BodyMode;
  raw?: string;
  rawType?: RawType;
  formdata?: IFormData[];
}

export interface IRequest {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers?: IHeader[];
  queryParams?: IQueryParam[];
  body?: IBody;
  auth?: IAuth;
  collection: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema: Schema<IRequest> = new Schema({
  name: { type: String, required: true },
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'], required: true },
  url: { type: String, required: true },

  headers: [{ key: String, value: String }],

  queryParams: [{ key: String, value: String }],

  body: {
    mode: { type: String, enum: ['raw', 'formdata'], default: 'raw' },
    raw: { type: String, default: '' },
    rawType: { type: String, enum: ['text', 'json', 'javascript', 'html', 'xml'], default: 'text' },
    formdata: [
      { key: String, value: String, type: { type: String, enum: ['text', 'file'], default: 'text' } }
    ]
  },

  auth: {
    type: {
      type: String,
      enum: ['inherit', 'noauth', 'basic', 'bearer', 'oauth2', 'apikey'],
      default: 'inherit'
    },
    basic: { username: String, password: String },
    bearer: { token: String },
    oauth2: { token: String },
    apiKey: { key: String, value: String, in: { type: String, enum: ['header', 'query'], default: 'header' } }
  },

  collection: { type: Schema.Types.ObjectId, ref: 'Collection' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRequest>('Request', RequestSchema);
