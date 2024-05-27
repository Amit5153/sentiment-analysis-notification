import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const sendEmail = async (to, subject, text) => {
  try {

    const authenticate = nodemailer.createTransport({
      service : "gmail",

      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER , 
        pass: process.env.EMAIL_PASS 
      },
    });

    // Email options
    const reciever = {
      from: process.env.EMAIL_USER, 
      to: process.env.ADMIN_EMAIL, 
      subject: subject, 
      text: text, 
      html: `<b>${text}</b>`, 
    };

    
    const info = await authenticate.sendMail(reciever);
    
    console.log(info)

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Error sending email:', error);
   
  }
};

export default sendEmail