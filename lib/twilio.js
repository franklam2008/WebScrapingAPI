function sendSMS(input) {
  const accountSid = process.env.TwilioAccountSid;
  const authToken = process.env.TwilioAuthToken;

  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: input.message,
      from: "+16232330663",
      to: `+1${input.phone}`
    })
    .then(message => console.log(message.sid))
    .catch(e => { console.error('Got an error:', e.code, e.message); });
}
module.exports = {
  sendSMS
};
