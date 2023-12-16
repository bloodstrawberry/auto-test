const nodemailer = require('nodemailer');

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.RECEIVER_EMAIL,
    subject: 'GitHub Action Email',
    text: 'This email was sent using GitHub Actions!',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

sendEmail();
