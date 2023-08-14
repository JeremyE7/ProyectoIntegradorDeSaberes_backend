import nodemailer from 'nodemailer';

export const sendEmail = async (email,subject,text) => {

    console.log(process.env.EMAIL_SENDER);
    console.log(process.env.PASSWORD_SENDER);
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Puedes cambiarlo por otros proveedores de correo
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.PASSWORD_SENDER,
        },
    });

    // Detalles del correo electrónico
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: subject,
        html: `<p>${text}</p><br/><b>Node.js Email with Secure OAuth and nodemailer</b>`,
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
}