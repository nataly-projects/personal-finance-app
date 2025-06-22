# Personal Finance App
A comprehensive web application designed to help users manage their personal finances by tracking transactions, setting budgets, monitoring expenses, and achieving financial goals.

## **Features**

### **💰 Transaction Management**
Easily add income and expense transactions with detailed categorization. 
Automatic categorization with custom category support

### **📋 Task Management**
Create tasks with due dates and descriptions.
Monitor task completion status and progress.
Never miss important financial tasks


### **📊 Data Visualization & Analytics**
View spending patterns through charts and graphs to better understand financial habits.

### **🎯 Budget Management**
Set and track monthly spending limits
Get notified when approaching budget limits

### **📧 Email Services**
Secure password reset via email
Email alerts for important financial events
Automated monthly financial summary emails

### **🔐 Security & Authentication**

Authentication: User authentication is managed via JSON Web Tokens (JWT) to ensure secure access to the application.
Environment Variables: Sensitive information such as database connection strings and secret keys are stored in environment variables using the dotenv package to keep credentials secure.
User Registration & Login: Secure sign-up and sign-in flow with validation and session management.
Password Management: Secure password reset and update flows with email verification.


## **Technologies Used**

### **Frontend**
- **Language:** TypeScript
- **Framework:** React
- **State Management:** Redux Toolkit
- **UI Library:** Material UI
- **Form Validation:** react-hook-form, yup
- **HTTP Client:** Axios
- **Routing:** react-router-dom
- **Charts:** Recharts for data visualization

### **Backend**
- **Language:** TypeScript
- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Environment Variables:** dotenv
- **Logging:** Winston
- **Email Service:** Nodemailer

## Installation
### Prerequisites
 - Ensure you have Node.js and npm installed on your machine
 - MongoDB installed locally or set up with a remote MongoDB URI
  - SMTP email service (Gmail, SendGrid, etc.) for email functionality

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
  JWT_SECRET=your-secret-key
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
