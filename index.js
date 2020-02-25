const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors"); //html bug
var http = require("http");
const path = require("path");
var validator = require("validator");
const morgan = require("morgan"); // log time
const port = process.env.PORT || "4000"; //port
const admin = require('firebase-admin') //firebase admin
// const serviceAccount = require('./ServiceAccountKey.json')
require("dotenv").config(); //.env
//lib
const scrapers = require("./lib/scrapers");
const youTubeScrapers = require("./lib/youTubeScrapers");
const hkfmScraper = require("./lib/hkfmScraper");
const corona = require("./lib/corona");
const db = require("./lib/db");
const airtable = require("./lib/airtable");
const twilio = require("./lib/twilio");
const sendGrid = require("./lib/sendGrid");

//app
app.use(cors());
app.use(morgan("short"));
app.use(bodyParser.json());
app.use((req, res, next) => {
  //local errorr
  res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
//firebase
admin.initializeApp({
  credential: admin.credential.cert({
    "project_id": process.env.FIREBASE_PRIVATE_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://my-firebase-app.firebaseio.com"
});
const fbdb = admin.firestore();
//frontPage
app.use(express.static(path.join(__dirname, "public"))); 

//auto awake server
setInterval(() => {
  console.log("Auto Awake log");
  http.get("http://secure-peak-92770.herokuapp.com/");

}, 900000); // every 15 minutes (1800000)


//getCreators
app.get("/creators", async (req, res) => {
  console.log("getcreators");
  const creators = await db.getAllCreators();
  res.send(creators);
});
//postCreators
app.post("/creators", async (req, res) => {
  console.log("POSTcreators");
  const channelData = await scrapers.scrapeChannel(req.body.input);
  const creators = await db.insertCreator(
    channelData.name,
    channelData.avatarURL,
    req.body.input
  );
  res.send(creators);
});

app.post("/youtube/:name", async (req, res) => {
  console.log('Youtube');

  console.log('req.params.name',req.params.name);
  const postData = await youTubeScrapers.youTubeScrapers(req.params.name);
  const result = {
    name: postData.name,
    fileURL: postData.fileURL,
    link: postData.link
  };
  res.send(result);
});
//submit form from Front-end
app.post("/submit", async (req, res) => {
  console.log("submit");
  console.log(req.body);

  //Validation name, email and phone#
  if (req.body.name === "") {
    res.send("Name Field Empty");
  } else if (!validator.isEmail(req.body.email)) {
    res.send("Email invalid");
  } else if (!validator.isMobilePhone(req.body.phone, ["en-US"])) {
    res.send("Phone Number invalid");
  } else if (req.body.message === "") {
    res.send("Message Missing");
  } else {
    // airtable
    airtable.airtableFunc(req.body);
    res.send("Submission Successful");
    if (req.body.checkbox) {
      // twilio
      twilio.sendSMS(req.body);
      // sendGrid
      sendGrid.sendEmail(req.body);
    }
  }
});

//
app.listen(port, () => console.log(`Frank Lam app listening on port ${port}!`));

//test

app.get("/refreshRadio", async(req, res) => {
  console.log("refreshRadio");
 //radio
  const postData = await hkfmScraper.hkfmScraper();
  //write to firestore public
  fbdb.collection("public")
  .doc("radio-morning")
  .update({radio:postData})
  .catch(error => {
    console.error("Error adding document: ", error);
  });;
 
res.send("refreshRadio completed");
});
app.get("/refreshCorona", async(req, res) => {
  //corona
  const post2Data = await corona.corona();
  fbdb.collection("public")
  .doc("corona")
  .update(post2Data)
  .catch(error => {
    console.error("Error adding document : ", error);
  });
res.send("refreshCorona completed");
});
