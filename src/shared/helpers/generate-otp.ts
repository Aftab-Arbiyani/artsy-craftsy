import { randomInt } from 'crypto';

const generateOtp = () => {
  const otp = randomInt(100000, 999999);

  return otp;
};

export default generateOtp;
