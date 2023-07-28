const { GraphQLString, GraphQLNonNull, GraphQLError } = require("graphql");
const { EmailSender } = require("../../../email/emailSender");

const emailSender = new EmailSender();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require("path");
const { models } = require("../../../models");

module.exports = {
    type: GraphQLString,
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, { email, url }, context) => {
        // check if email is already used
        const user = (await models.User.findOne({ where: { email: email } }));
        if (user) {
            throw new GraphQLError('Email used by an existing account.');
        }

        // create a jwt for email and url
        const token = jwt.sign(
            { data: { email } },
            process.env.JWT_SECRET,
            { expiresIn: '2h' },
        );

        let htmlTemplate = fs.readFileSync(path.join(process.cwd(), 'src', 'email', 'confirm-email-template.html'), 'utf-8');
        let textTemplate = fs.readFileSync(path.join(process.cwd(), 'src', 'email', 'confirm-email-template.txt'), 'utf-8');

        htmlTemplate = EmailSender.injectTemplate(htmlTemplate, { url, token });
        textTemplate = EmailSender.injectTemplate(textTemplate, { url, token });

        try {
            const result = await emailSender.sendEmail({
                from: '"Hillside Hotel" hillsidehotel.demo@gmail.com',
                to: email,
                subject: 'Confirm Email',
                text: textTemplate,
                html: htmlTemplate,
            });
            console.log(result);
        } catch (error) {
            if (error.message === 'No recipients defined') {
                throw new GraphQLError('Invalid email.');
            }
            throw new GraphQLError('Something went wrong. Try again.');
        }

        return "OK";
    }
}