import { randomInt } from 'crypto';

export const generateOTP = async () => {
  return await randomInt(100000, 1000000); // Generates a 6-digit OTP
};
