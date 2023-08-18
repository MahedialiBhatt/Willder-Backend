import { Request, Response, NextFunction } from 'express';
import * as service from './account.service';
import { badImplementationException } from '../../../utils/apiErrorHandler';
import { logger } from 'firebase-functions/v1';

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, address } = req.body;
    const user_id = req.user.user_id;
    if (!user_id) throw badImplementationException('user_id is not set properly');
    await service.updateAccount(user_id, name, phone, address);

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    const user_id = req.user.user_id;
    if (!user_id) throw badImplementationException('user_id is not set properly');
    await service.updatePassword(user_id, password);
    res.status(200).json({ message: 'OK' });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const getAccountInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    if (!user_id) throw badImplementationException('user_id is not set properly');
    const user = await service.getAccountInfo(user_id);
    res.status(200).json(user);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
