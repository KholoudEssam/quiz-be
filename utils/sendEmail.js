const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendMail = (sendTo) => {
    const msg = {
        to: sendTo,
        from: process.env.FROM_EMAIL,
        subject: 'Quiz Submitted!',
        text: 'User has finished a quiz',
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error.message);
        });
};
