const nodemailer = require('nodemailer');

class EmailSender {
    constructor({ emailService = null, username = null, password = null } = {}) {
        this.transporter = nodemailer.createTransport({
            service: emailService || process.env.EMAIL_SERVICE,
            auth: {
                user: username || process.env.EMAIL_USERNAME,
                pass: password || process.env.EMAIL_PASSWORD,
            },
        });
    }

    async verify() {
        const result = await this.transporter.verify();
        return result;
    }

    async sendEmail({ from, to, subject, text, html }) {
        const info = await this.transporter.sendMail({ from, to, subject, text, html });
        return info;
    }

    static injectTemplate(template, data) {
        const extractVariables = (str) => {
            const regex = /{{(.*?)}}/g;
            const matches = [];
            let match;

            while ((match = regex.exec(str))) {
                matches.push(match[1].trim());
            }

            return matches;
        }
        extractVariables(template).forEach(variable => {
            template = template.replace(`{{${variable}}}`, data[variable]);
        })
        return template;
    }
}

module.exports = { EmailSender };