import nodemailer from 'nodemailer';
import config from '../config';

const sendVerifyMail = async (name: string, email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.pass,
      },
    });

    const mailOptions = {
      from: config.nodemailer.user,
      to: email,
      subject: 'Verify your account',
      html: `<h1>Hi ${name}</h1><br><p>Click this link to verify your account: <a href="https://dashboard-server-xi-nine.vercel.app/api/v1/user/active-account/${token}">Verify</a></p>
      <p>your email ${email}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
  } catch (error) {}
};

export default sendVerifyMail;
