const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, subject, text, html) {
    const message = {
      from: 'Game Simulator <no-reply@game-simulator.com>',
      to: targetEmail,
      subject,
      text,
      html,
      //   attachments: [{ filename: 'playlists.json', content }],
    };
    // eslint-disable-next-line no-underscore-dangle
    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
