const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.APP_BASE_URL}/verify-email/${token}`;
  console.log(user);
  const emailBody = `
    <p>Hello ${user.name},</p>
    <p>Please click the following link to verify your email address:</p>
    <a href="${verificationLink}">${verificationLink}</a>
  `;
  const mailOptions = {
    from: "HR Management System <noreply@yourapp.com>",
    to: user.email,
    subject: "Verify Your Email",
    html: emailBody,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user}`);
  } catch (error) {
    console.error(`Error sending verification email: ${error}`);
  }
};

const sendPasswordResetEmail = async (user, token) => {
  const resetLink = `${process.env.APP_BASE_URL}/reset-password/${token}`;
  const emailBody = `
    <p>Hello ${user.name},</p>
    <p>Please click the following link to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;
  const mailOptions = {
    from: "HR Management System <noreply@yourapp.com> ",
    to: user.email,
    subject: "Reset Your Password",
    html: emailBody,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending password reset email: ${error}`);
  }
};




module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,

};
