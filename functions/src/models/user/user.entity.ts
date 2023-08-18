import { firestore } from 'firebase-admin';

export type UserDocument = {
  user_id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  refresh_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: firestore.Timestamp | null;
};

export const USER_COLLECTION_KEY = 'users';
