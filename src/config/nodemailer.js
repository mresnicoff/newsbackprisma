 nodemailer= require( "nodemailer");

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
  tls: {
    rejectUnauthorized: false
}
});

const mailOptions = {
  from: "Mis Noticias <flightdeck2023@gmail.com>",
 
};
module.exports={mailOptions,transporter}