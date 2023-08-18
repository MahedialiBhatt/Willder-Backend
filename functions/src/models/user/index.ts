import { badImplementationException } from '../../utils/apiErrorHandler';
import { comparePassword } from '../../utils/bcrypt';
import { db } from '../../utils/firebase';
import { UserDocument, USER_COLLECTION_KEY } from './user.entity';

export const addUser = async (user: UserDocument) => {
  try {
    const newUser = db.collection(USER_COLLECTION_KEY).add(user);
    return Promise.resolve(newUser);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const userDocs = await db.collection(USER_COLLECTION_KEY).where('email', '==', email).get();
    const users = userDocs.docs.map((doc) => doc.data() as UserDocument);
    return users;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateUserFields = async (user_id: string, updatedData: Partial<UserDocument>) => {
  try {
    const userDoc = db.collection(USER_COLLECTION_KEY);
    const querySnap = await userDoc.where('user_id', '==', user_id).get();
    if (querySnap.empty) throw badImplementationException('User not found');
    await querySnap.docs[0].ref.update(updatedData);
    return Promise.resolve('success');
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteUser = async (user_id: string) => {
  try {
    const userDoc = db.collection(USER_COLLECTION_KEY).doc(user_id);
    await userDoc.update({ is_deleted: true });
    return Promise.resolve('success');
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUser = async (user_id: string) => {
  try {
    const userDoc = await db.collection(USER_COLLECTION_KEY).doc(user_id).get();
    return userDoc.data();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const checkPassword = async (email: string, password: string) => {
  try {
    const userDocs = await db.collection(USER_COLLECTION_KEY).where('email', '==', email).get();
    const users = userDocs.docs.map((doc) => doc.data() as UserDocument);
    if (users.length === 0) return false;
    const user = users[0];
    if (await comparePassword(password, user.password)) return true;
    return false;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUserById = async (user_id: string) => {
  try {
    const userDocs = await db.collection(USER_COLLECTION_KEY).where('user_id', '==', user_id).get();
    const users = userDocs.docs.map((doc) => doc.data() as UserDocument);
    if (users.length === 0) return null;
    return users[0];
  } catch (err) {
    return Promise.reject(err);
  }
};
