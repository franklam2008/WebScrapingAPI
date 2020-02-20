var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_APIKEY}).base(process.env.AIRTABLE_BASE);

process.env.apiKey
function airtableFunc(body) {

    base('General User Survey').create({
        "Comments": body.message,
        "Name": body.name,
        "Recommend to another?": "5. Very Likely",
        "Email": body.email,
        "Phone Number": body.phone,
      }, function(err, record) {
        if (err) {
          console.error(err);
          return err;
        }
        console.log(record.getId());
      });
  }
  module.exports = {
    airtableFunc
  }
  