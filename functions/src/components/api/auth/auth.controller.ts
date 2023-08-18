import { Request, Response, NextFunction } from 'express';
import { logger } from 'firebase-functions/v1';
import { decodeJwt, encodeJwt } from '../../../utils/jwt';
import * as service from './auth.service';
import { getCurrentJST } from '../../../utils/dayjs';
import {
  badImplementationException,
  dataNotExistException,
  unauthorizedException,
} from '../../../utils/apiErrorHandler';
import { checkPassword, getUser, getUserByEmail, getUserById, updateUserFields } from '../../../models/user';
import { addToken, deleteToken } from '../../../models/token';
import { TokenDocument } from '../../../models/token/token.entity';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone, address } = req.body;

    await service.createUser(email, password, name, phone, address);
    res.status(200).json();
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw badImplementationException('email or password is not set properly');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    const user = await getUserByEmail(email);
    if (user.length === 0) throw dataNotExistException('Email does not register');
    const passwordCheck = await checkPassword(email, password);
    if (!passwordCheck) throw unauthorizedException('Password is not correct');

    const accessToken = encodeJwt({ id: user[0].user_id }, ACCESS_TOKEN_EXPIRED_IN || '1m', 'access');
    const refreshToken = encodeJwt({ id: user[0].user_id }, REFRESH_TOKEN_EXPIRED_IN || '2m', 'refresh');

    await updateUserFields(user[0].user_id, { refresh_token: refreshToken, updated_at: getCurrentJST() });
    const tokenToFirebase: TokenDocument = {
      token_id: refreshToken,
      user_id: user[0].user_id,
      token_type: 'resetPassword',
      user_type: 'user',
      created_at: getCurrentJST(),
      expired_at: '',
    };
    await addToken(tokenToFirebase);
    res.status(200).json({ accessToken, refreshToken });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    if (!user_id) throw badImplementationException('user_id is not set properly');

    await updateUserFields(user_id, { refresh_token: null, updated_at: getCurrentJST() });
    await deleteToken(req.headers['authorization'] ?? '');
    res.status(200).json('Successfully logout');
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const users = await getUserByEmail(email);

    if (users.length === 0) throw dataNotExistException('Email does not register');
    if (users.length > 1) throw badImplementationException('Something went wrong. Email is more than 1.');
    if (users[0].status !== 'active') throw unauthorizedException('This user is unauthorized.');

    service.forgotPassword(users[0]);

    res.status(200).json('Successfully send email');
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, tokenId } = req.body;

    await service.updatePassword(password, tokenId);

    res.status(200).json();
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const decoded = decodeJwt(refreshToken, 'refresh');

    if (typeof decoded === 'string') {
      throw new Error('Invalid JWT token');
    }

    const user = await getUserById(decoded.id);
    if (!user) throw unauthorizedException('User is not exist');
    if (user.status !== 'active') throw unauthorizedException('This user is not active');
    if (user.refresh_token !== refreshToken) throw unauthorizedException('Refresh token is not valid');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    const accessToken = encodeJwt({ id: user.user_id }, ACCESS_TOKEN_EXPIRED_IN || '5m', 'access');
    const newRefreshToken = encodeJwt({ id: user.user_id }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');

    // update refresh token
    await updateUserFields(user.user_id, { refresh_token: newRefreshToken, updated_at: getCurrentJST() });

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
};
