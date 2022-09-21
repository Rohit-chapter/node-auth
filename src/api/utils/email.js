const fs = require("fs");
const path = require("path");
const handlebar = require("handlebars");
const nodemailer = require("nodemailer");
const { Console } = require("console");

const AVAILABLE_TEMPLATES = {
    FORGET_PASSWORD: "forgotPassword.hbs",
};

class Email {
    constructor(template = "") {
        this.body = "";
        this.subject = "";
        this.cc = [];
        if (template) {
            this.setTemplate(template);
        }
    }


    async setTemplate(templateName, replaceObject = {}) {
        switch (templateName) {
            case AVAILABLE_TEMPLATES.FORGET_PASSWORD:
                this.subject = 'Reset password';
                break;
            default:
                break;
        }
        const header = fs.readFileSync(
            path.join(__dirname, '..', 'templates', 'header.hbs'),
            'utf8'
        );

        const footer = fs.readFileSync(
            path.join(__dirname, '..', 'templates', 'footer.hbs'),
            'utf8'
        );

        const content = `${header}${fs.readFileSync(
            path.join(__dirname, '..', 'templates', `${templateName}`),
            'utf8'
        )}${footer}`;

        const template = handlebar.compile(content);
        this.body = template({
            ...replaceObject,
            webURL: this.webURL,
            adminURL: this.adminURL
        })

        return this.body;
    }

    setRawBody(body) {
        this.body = body;
    }

    setSubject(subject) {
        this.subject = subject;
    }

    setCC(email) {
        this.cc = email;
    }

    async send(email) {
        if (!email) {
            throw new Error("Email not set");
        }
        if (!this.body || !this.subject) {
            throw new Error("Body or subject not set");
        }


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"Red-Bus" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: "Successfully Booked Your Ticket",
            html: this.body,
        });

        return info;
    }

    static sendEmail(template, data, email, cc = []) {
        const emailClient = new Email(template);
        emailClient.setBody(data);
        emailClient.setCC(cc);
        return emailClient.send(email);
    }
}

module.exports = {
    Email,
    AVAILABLE_TEMPLATES,
};