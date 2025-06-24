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

interface ResetCodeEmailData {
  email: string;
  verificationCode: string;
  userName: string;
}

interface PasswordUpdateData {
  email: string;
  verificationCode: string;
  userName: string;
}

interface OutcomeLimitExceededData {
  email: string;
  userName: string;
  limit: number;
  currentTotal: number;
}

interface MonthlySummaryEmailData {
  email: string;
  userName: string;
  totalIncome: number;
  totalExpenses: number;
  topCategories: { name: string; amount: number }[];
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

export const sendResetCodeEmail = async (data: ResetCodeEmailData): Promise<void> => {
  const mailOptions = {
    from: appEmail,
    to: data.email,
    subject: EMAIL_SUBJECTS.PASSWORD_RESET,
    html: ` 
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff;">Password Reset Code</h2>
        <p>Hello ${data.userName},</p>
        <p>You recently requested to reset your password for Personal Finance App. Please use the following code to reset your password:</p>
        <div style="width: fit-content; background-color: #007bff; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; text-align: center;">
            <strong>${data.verificationCode}</strong>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you.</p>
      </div>
    </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset code sent to ${data.email}`);
  } catch (error) {
    logger.error(`Error sending password reset email to ${data.email}:`, error);
    throw error;
  }
};

export const sendPasswordUpdateEmail = async (data: PasswordUpdateData): Promise<void> => {
  const mailOptions = {
    from: appEmail,
    to: data.email,
    subject: EMAIL_SUBJECTS.PASSWORD_UPDATE,
    html: ` 
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff;">Password Updated Successfully</h2>
        <p>Hello ${data.userName},</p>
        <p>Your password for Personal Finance App has been successfully updated.</p>
        <p>If you did not make this change, please contact us immediately.</p>
        <p>Thank you.</p>
      </div>
    </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password update confirmation sent to ${data.email}`);
  } catch (error) {
    logger.error(`Error sending password update confirmation to ${data.email}:`, error);
    throw error;
  }
}; 

export const sendOutcomeLimitExceededEmail = async (data: OutcomeLimitExceededData): Promise<void> => {
  const mailOptions = {
    from: appEmail,
    to: data.email,
    subject: EMAIL_SUBJECTS.MONTHLYֹֹ_EXCEED,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #d32f2f;">Budget Limit Alert</h2>
        <p>Hello ${data.userName},</p>
        <p>Your monthly outcome has exceeded the limit of <strong>${data.limit}₪</strong>.</p>
        <p>Current total expenses this month: <strong>${data.currentTotal}₪</strong>.</p>
        <p>Please review your expenses to stay on track.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Outcome alert sent to ${data.email}`);
  } catch (error) {
    logger.error(`Error sending outcome alert to ${data.email}:`, error);
    throw error;
  }
};

export const sendMonthlySummaryEmail = async (data: MonthlySummaryEmailData): Promise<void> => {
  const categoryList = data.topCategories.map(cat => `<li>${cat.name}: ${cat.amount}₪</li>`).join('');

  const mailOptions = {
    from: appEmail,
    to: data.email,
    subject: EMAIL_SUBJECTS.MONTHLY_SUMMARY,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #007bff;">Hello ${data.userName},</h2>
        <p>Here’s your monthly summary:</p>
        <ul>
          <li><strong>Total Income:</strong> ${data.totalIncome}₪</li>
          <li><strong>Total Expenses:</strong> ${data.totalExpenses}₪</li>
        </ul>
        <p>Top Spending Categories:</p>
        <ul>${categoryList}</ul>
        // <p>Tip of the Month: <i>"Track every shekel — it adds up fast!"</i></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Monthly summary sent to ${data.email}`);
  } catch (error) {
    logger.error(`Error sending monthly summary to ${data.email}:`, error);
    throw error;
  }
};