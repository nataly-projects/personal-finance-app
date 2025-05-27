const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 

const EMAIL_SUBJECTS = {
  CONTACT_US: 'New Contact Us Message From Personal Finance App',
  PASSWORD_RESET: 'Password Reset Verification Code',
  PASSWORD_UPDATE: 'Password Update Verification Code',
};

module.exports = {
  generateVerificationCode,
  EMAIL_SUBJECTS
};