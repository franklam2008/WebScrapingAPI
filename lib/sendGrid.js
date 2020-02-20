const email = require("./email");

function sendEmail(input) {
  const emailTemp = email.template(input.name);
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: input.email,
    from: "franklam2008@gmail.com",
    subject: "Thank you submitting for your message",
    text: input.message,
    html: emailTemp
  };
  sgMail.send(msg);
  

  console.log("Email Sent");
}
module.exports = {
  sendEmail
};
