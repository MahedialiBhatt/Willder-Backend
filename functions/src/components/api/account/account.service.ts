import { logger } from 'firebase-functions/v1';
import { HttpException, badImplementationException } from '../../../utils/apiErrorHandler';
import { getUserById, updateUserFields } from '../../../models/user';
import { hashPassword } from '../../../utils/bcrypt';

export const updateAccount = async (user_id: string, name: string, phone: string, address: string) => {
  let error: Error | HttpException | undefined;
  try {
    const isUserExsits = await getUserById(user_id);
    if (!isUserExsits) throw badImplementationException('User not found');
    await updateUserFields(user_id, { name, phone, address });
    return Promise.resolve('Update success');
  } catch (err) {
    logger.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};

export const updatePassword = async (user_id: string, password: string) => {
  let error: Error | HttpException | undefined;
  try {
    const isUserExsits = await getUserById(user_id);
    if (!isUserExsits) throw badImplementationException('User not found');
    const hashedPassword = await hashPassword(password);
    await updateUserFields(user_id, { password: hashedPassword });
    return Promise.resolve('Update success');
  } catch (err) {
    logger.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};

export const getAccountInfo = async (user_id: string) => {
  let error: Error | HttpException | undefined;
  try {
    const isUserExsits = await getUserById(user_id);
    if (!isUserExsits) throw badImplementationException('User not found');
    const user = await getUserById(user_id);
    return Promise.resolve(user);
  } catch (err) {
    logger.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};
