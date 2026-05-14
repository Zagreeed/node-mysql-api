import nodemailer from "nodemailer"
import config from "../../config.prod.json"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


// ADD "from = config.emailform" to the parameter for SMTP EMAIL LIKE ETHEREAL 
export default async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }: any) {
    // THE CODE BELOW ARE FOR ETHEAREAL EMAILL
    // const transporter = nodemailer.createTransport({
    //     ...config.smtOptions,
    //     connectionTimeout: 10000,
    //     greetingTimeout: 10000,
    //     socketTimeout: 10000,
    // })
    // await transporter.sendMail({ from, to, subject, html })


    // THE CODE BELOW ARE USED FOR RESEND EMAILL
    const sandboxTo = process.env.RESEND_VERIFIED_EMAIL ?? to;
    const finalSubject = sandboxTo !== to
        ? `[→ ${to}] ${subject}`
        : subject;


    const { data, error } = await resend.emails.send({
        from,
        to: sandboxTo,
        subject: finalSubject,
        html
    });

    if (error) {
        return console.error({ error });
    }

    console.log({ data });
}