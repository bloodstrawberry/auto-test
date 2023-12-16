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

  const mailOptions = {
    to: process.env.RECEIVER_EMAIL,
    subject: process.env.COMMIT_MESSAGE_SUBJECT,
    text: process.env.COMMIT_MESSAGE_BODY.replace(/\\n/g, '\n'),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

sendEmail();
