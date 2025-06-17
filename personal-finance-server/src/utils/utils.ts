export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 

export const EMAIL_SUBJECTS = {
  CONTACT_US: 'New Contact Us Message From Personal Finance App',
  PASSWORD_RESET: 'Password Reset Verification Code From Personal Finance App',
  PASSWORD_UPDATE: 'Password Update Verification Code From Personal Finance App',
} as const; 