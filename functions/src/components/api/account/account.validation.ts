import { Schema } from 'express-validator';
import { VALIDATION_ACCOUNT_TEL, VALIDATION_PASSWORD, VALIDATION_STRING } from '../../../constants/validation';

export const ACCOUNT_SCHEMA: Schema = {
  name: VALIDATION_STRING('body'),
  phone: VALIDATION_ACCOUNT_TEL('body'),
  address: VALIDATION_STRING('body'),
};

export const ACCOUNT_PASSWORD_SCHEMA: Schema = {
  password: VALIDATION_PASSWORD('body'),
};
