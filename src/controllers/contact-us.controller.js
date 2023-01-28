const { Settings } = require('../models');
const MailSender = require('../utils/mail-sender');
const { createSuccessResponse } = require('../utils/response');

exports.sendMail = async (req, res, next) => {
  try {
    const setting = await Settings.findOne();
    if (!setting) throw new Error('Something went wrong');

    const { subject, email, message } = req.body;
    const mailSender = new MailSender();
    mailSender.sendEmail(
      setting.email,
      `Effeg Contact US [${subject}]`,
      null,
      `<div>
            <p>
                <strong>${email}</strong> just sent new messages
            </p>
            <p>Messages:</p>
            <p style="whitespace: pre-line;">
                ${message}
            </p>
        </div>`,
    );
    return createSuccessResponse(res, 'Email sent');
  } catch (error) {
    return next(error);
  }
};
