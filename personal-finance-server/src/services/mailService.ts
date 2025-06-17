import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { EMAIL_SUBJECTS } from '../utils/utils';
import { logger } from '../utils/logger';

dotenv.config();

const appEmail = process.env.EMAIL; 
const emailKey = process.env.EMAIL_KEY;

interface MessageData {
  name: string;
  email: string;
  message: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: appEmail, 
    pass: emailKey, 
  },
});

export const sendContactEmail = async (messageData: MessageData): Promise<void> => {
  const mailOptions = {
    from: messageData.email,
    to: appEmail, 
    subject: EMAIL_SUBJECTS.CONTACT_US,
    html: ` 
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff;">New Message From Personal Finance</h2>
        <p>Message from: ${messageData.name} </p>
        <p>Email: ${messageData.email}</p>          
        <p>The message: ${messageData.message}</p>        
      </div>
    </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Contact email sent from ${messageData.email}`);
  } catch (error) {
    logger.error(`Error sending contact email from ${messageData.email}:`, error);
    throw error;
  }
};

export const sendResetCodeEmail = async (email: string, verificationCode: string, userName: string): Promise<void> => {
  const mailOptions = {
    from: appEmail,
    to: email,
    subject: EMAIL_SUBJECTS.PASSWORD_RESET,
    html: ` 
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff;">Password Reset Code</h2>
        <p>Hello ${userName},</p>
        <p>You recently requested to reset your password for Personal Finance App. Please use the following code to reset your password:</p>
        <div style="width: fit-content; background-color: #007bff; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; text-align: center;">
            <strong>${verificationCode}</strong>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you.</p>
      </div>
    </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset code sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending password reset email to ${email}:`, error);
    throw error;
  }
};

export const sendPasswordUpdateEmail = async (email: string, userName: string): Promise<void> => {
  const mailOptions = {
    from: appEmail,
    to: email,
    subject: EMAIL_SUBJECTS.PASSWORD_UPDATE,
    html: ` 
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff;">Password Updated Successfully</h2>
        <p>Hello ${userName},</p>
        <p>Your password for Personal Finance App has been successfully updated.</p>
        <p>If you did not make this change, please contact us immediately.</p>
        <p>Thank you.</p>
      </div>
    </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password update confirmation sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending password update confirmation to ${email}:`, error);
    throw error;
  }
}; 