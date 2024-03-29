const fs = require('fs');
const nodemailer = require('nodemailer');

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.NODE_MAIL_USER,
      pass: process.env.NODE_MAIL_PASS,
    },
  });

  console.log(process.env.NODE_MAIL_USER);
  let message = process.env.COMMIT_MESSAGE_BODY.replace(/\\n/g, "\n").split("\n");
  let contents = message.slice(2, message.length).join("\n");
  let address = fs.readFileSync("actions/mail_receiver.txt", "utf8");
  
  const mailOptions = {
    to: address,
    subject: process.env.COMMIT_MESSAGE_SUBJECT,
    text: contents,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

sendEmail();
