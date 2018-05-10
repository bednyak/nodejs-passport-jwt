const api_key = 'key-d4f3acb3ccfa8690f67ceee0f8b01440',
    domain = 'sandbox165bf8b3a9ef48b485e626b4131f9adc.mailgun.org',
    mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

module.exports.sendEmail = (to, subject, text) => {
    const data = {
        from: 'NPLJ_Mail_Bot <nplj_bot@samples.mailgun.org>',
        to: to,
        subject: subject,
        text: text
    };

    mailgun.messages().send(data, function(error, body) {
        console.log(body);
    });
};
