export const EmailVerificationTemplate = (otp: string) => {
  return { subject: 'OTP for Verification', text: `OTP - ${otp}` };
};
