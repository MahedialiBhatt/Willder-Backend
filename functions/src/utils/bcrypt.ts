import bcrypt from 'bcryptjs';

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};
