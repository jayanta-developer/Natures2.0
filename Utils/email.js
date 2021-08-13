const { models } = require('mongoose');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create a transpoter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Defain the email option
  const mailOptions = {
      from: 'Jayanta dey <jayantadey398@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message
  }
  //Actualy send the email
 await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;