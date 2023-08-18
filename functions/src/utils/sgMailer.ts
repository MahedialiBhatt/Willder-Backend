import sgMail, { MailDataRequired } from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendMessage = async (message: MailDataRequired) => {
  try {
    await sgMail.send(message);
    return Promise.resolve('Send message success');
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
};
