# Personal Finance App
A comprehensive web application designed to help users manage their personal finances by tracking transactions, setting budgets, monitoring expenses, and achieving financial goals.

## **Features**

### **💰 Transaction Management**
- Easily add income and expense transactions with detailed categorization
- Automatic categorization with custom category support

### **📋 Task Management**
- Create tasks with due dates and descriptions
- Monitor task completion status and progress
- Never miss important financial tasks

### **📊 Data Visualization & Analytics**
- Dynamic Charts: Built with Recharts to visualize spending patterns.
- Comprehensive monthly and yearly reports to monitor financial habits over time.

### **🎯 Budget & Settings**
- Smart Limits: Set monthly spending limits and track progress in real-time.
- Theme Support: Fully integrated Dark/Light mode, managed via Redux Toolkit and persistent across sessions.
- Custom Notifications: Toggle email alerts for budget milestones and task deadlines.


### **🔐 Security & Authentication**
- Secure Access: Managed via JSON Web Tokens (JWT).
- Password Management: Secure reset flows with email verification via Nodemailer.
- Environment Safety: Sensitive credentials stored securely using dotenv.


## **Technologies Used**

### **Frontend**
- **Framework:** React with TypeScript.
- **Server State:** React Query – managing all API interactions, caching, and loading states.
- **Client State:** Redux Toolkit – managing global UI states like themes.
- **UI Library:** Material UI
- **Form Validation:** react-hook-form, yup
- **HTTP Client:** Axios
- **Routing:** react-router-dom
- **Charts:** Recharts for data visualization

### **Backend**
- **Environment:** Node.js with Express.js & TypeScript.
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Environment Variables:** dotenv
- **Logging:** Winston
- **Email Service:** Nodemailer
- **Centralized Error Handling:** Custom `ApiError` class and an `asyncHandler` wrapper to eliminate try-catch boilerplate.

## Installation
### Prerequisites
 - Ensure you have Node.js and npm installed on your machine
 - MongoDB installed locally or set up with a remote MongoDB URI
  - SMTP email service for email functionality

### Steps
1. Clone the repository:
  ```
  git clone https://github.com/nataly-projects/personal-finance-app.git
  cd personal-finance
  ```

2. Create a `.env` file in the `personal-finance-server` directory and add the following:
  ```
  MONGO_URI=your-mongodb-connection-string
  PORT=5000
  JWT_SECRET_KEY=your-secret-key
  EMAIL=your-email@gmail.com
  EMAIL_KEY=your-email-app-key
  ```

3. Install dependencies:

- Server Side:
```
cd personal-finance-server
npm install
```
- Client Side:
```
cd personal-finance-client
npm install
```

4. Run the Server and Client:

- In one terminal window (Server):
```
cd personal-finance-server
npm start  
```
- In another terminal window (Client):
```
cd personal-finance-client
npm start
```
5. Open your browser and navigate to:
```
http://localhost:3000
```
