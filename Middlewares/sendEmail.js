const nodemailer = require("nodemailer");
module.exports.sendEmail = (receiver, text, subject) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // user: "securesally@gmail.com",
        user: "janzhen90@gmail.com",
        pass: "hjcgzqhihmphojeb",
      },
    });

    const mail_config = {
      from: "janzhen90@gmail.com",
      to: receiver,
      subject: subject,
      text: text,
    };

    transporter.sendMail(mail_config, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: "An error has occured!" });
      }
      console.log("sent");
      return resolve({ message: "Email has been sent successfully!" });
    });
  });
};
