import nodemailer from "nodemailer"
import config from "../../config.json"

export default async function sendEmail({to, subject, html, from = config.emailform}:any){
    const transporter = nodemailer.createTransport(config.smtOptions)
    await transporter.sendMail({from, to, subject, html})
}