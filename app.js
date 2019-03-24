const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// static folder
app.use('/public', express.static(path.join(__dirname, 'public')));;
// body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get ('/', (req, res) => {
  res.render('contact', {msg: 'email has been sent'});
});

app.post ('/send', (req, res) => {
  const output =  `
  <p> you have a new contact request </p>
  <h3> contact details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.Company}</li>
    <li>Email: ${req.body.Email}</li>
    <li>Phone: ${req.body.Phone}</li>
  </ul>
  <h3> message</h3>
  <p>${req.body.message}</p>
  `;
  // create reusable transporter object using the default SMTP transport
let smtpTransporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: true, // true for 465, false for other ports
   //Service: 'gmail',
   auth: {
     user: '6sidecontracting@gmail.com', // generated ethereal user
     pass: 'T0uchID!' // generated ethereal password
   },
  tls:{
    rejectUnauthorized:false
  }
});

 // setup email data with unicode symbols
let mailOptions = {
   from: '"NodeMailerContact" <6sidecontracting@gmail.com>', // sender address
   to: "6sidecontracting@gmail.com", // list of receivers
   subject: "NewContact", // Subject line
   text: "Hello world?", // plain text body
   html: output  // html body
};
// send mail with defined transport object
smtpTransporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.render('contact', {msg: "Email has been sent"});
});
});
app.listen(3000, () => console.log('server started...'));
