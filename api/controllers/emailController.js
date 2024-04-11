import nodemailer from "nodemailer";

export const sendEmail = (data, req, res, next) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  async function main() {
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"PrimeBazaar👻" <abc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });

      console.log("Message sent: %s", info.messageId);

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        data: info,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  // Call the main function to send the email
  main();
};
