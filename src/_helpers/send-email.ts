import nodemailer from "nodemailer"
import config from "../../config.prod.json"

export default async function sendEmail({ to, subject, html, from = config.emailform }: any) {
    const transporter = nodemailer.createTransport({
        ...config.smtOptions,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    })
    await transporter.sendMail({ from, to, subject, html })
}