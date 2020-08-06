const logger = require("../../services/logger.service");
const nodemailer = require("nodemailer");

const mockEmail = "tetch6@gmail.com";

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//##################################
// SEND TEST EMAIL
async function sendTestMail() {
  console.log("Sending test...");
  // setup email data
  let mailOptions = {
    from: '"TESTING" doron@pharma-soft.co.il', // sender address
    to: "tetch6@gmail.com", // email for dev purposes
    subject: "testing nodemailer", // Subject line
    html: `<h1>This is a test e-mail</h1>`, // html body
  };
  // send mail with defined transport object
  return sendTransportObject(mailOptions);
}

//##################################
// SEND CONFIRMATION EMAIL TO USER
async function sendConfirmationMail(email, password) {
  console.log("Sending confirmation...");
  const siteLink = "http://pharma-soft.co.il/product";
  // HTML output - email content
  const output = `
  <div>
    <p>הרשמתך למערכת פארמה סופט הסתיימה בהצלחה</p>
    <h3>פרטי ההתחברות שלך הם:</h3>
    <ul>  
      <li>שם משתמש: ${email}</li>
      <li>סיסמה: ${password}</li>
    </ul>
    <a href=${siteLink}>עבור אל רשימת התרופות</a>
    <p>בברכה פארמה סופט בע"מ</p>
    </div>`;

  // setup email data
  let mailOptions = {
    from: '"Pharma-Soft LTD"  doron@pharma-soft.co.il', // sender address
    to: `${process.env.NODE_ENV === "production" ? email : mockEmail}`, // list of receivers
    subject: "התחברות למערכת פארמה סופט", // Subject line
    html: output, // html body
  };

  // send mail with defined transport object
  sendTransportObject(mailOptions);
}

//##################################
// SEND APPLICATION INFO TO ADMIN
async function newUserApplication(
  fullName,
  company,
  email,
  phone,
  streetAddress,
  city
) {
  console.log("Sending Application...");

  // HTML output - email content
  const output = `
    <h3>משתמש חדש מבקש להתחבר למערכת</h3>
    <p>פרטי המשתמש הם</p>
    <ul>
      <li>שם: ${fullName}</li>
      <li>חברה: ${company}</li>
      <li>אימייל: ${email}</li>
      <li>טלפון: ${phone}</li>
      <li>רחוב ומספר: ${streetAddress}</li>
      <li>עיר: ${city}</li>
    </ul>`;

  // setup email data
  let mailOptions = {
    from: '"Pharma-Soft LTD" doron@pharma-soft.co.il', // sender address
    to: `${
      process.env.NODE_ENV === "production"
        ? "doron@pharma-soft.co.il"
        : mockEmail
    }`,
    subject: "הוספת משתמש חדש למערכת",
    html: output,
  };
  // send mail with defined transport object
  sendTransportObject(mailOptions);
}

//##################################
// SEND CONTACT FORM TO PHARMA-SOFT
async function contactForm(fullName, company, email, phone, comments) {
  console.log("Sending Form...");

  // HTML output - email content
  const output = `
  <h3>טופס יצירת קשר פארמה סופט</h3>
  <p>פרטי המוען</p>
  <ul>
  <li>שם: ${fullName}</li>
  <li>חברה: ${company}</li>
  <li>אימייל: ${email}</li>
  <li>טלפון: ${phone}</li>
  <li>הערות: ${comments}</li>
  </ul>`;

  // setup email data
  let mailOptions = {
    from: '"Pharma-Soft LTD" doron@pharma-soft.co.il', // sender address
    to: `${
      process.env.NODE_ENV === "production"
        ? "doron@pharma-soft.co.il"
        : mockEmail
    }`,
    subject: "טופס יצירת קשר",
    html: output,
  };
  // send mail with defined transport object
  sendTransportObject(mailOptions);
}

//##################################
// USER FORGOT PASSWORD
async function forgotPassword(email) {
  console.log("Sending Request...");

  // HTML output - email content
  const output = `
  <h3>משתמש רשום מבקש לשנות סיסמה</h3>
  <label>אימייל: ${email}</label>`;

  // setup email data
  let mailOptions = {
    from: '"Pharma-Soft LTD" doron@pharma-soft.co.il', // sender address
    to: `${
      process.env.NODE_ENV === "production"
        ? "doron@pharma-soft.co.il"
        : mockEmail
    }`,
    subject: "איפוס סיסמה",
    html: output,
  };
  // send mail with defined transport object
  sendTransportObject(mailOptions);
}

//##################################
// SEND NEW PASSWORD FOR USER
function sendNewPasswordToUser(email, password) {
  console.log("Sending Request...");

  // HTML output - email content
  const output = `
  <h3>סיסמתך שונתה</h3>
  <ul>
    <li>אימייל: ${email}</li>
    <li>סיסמה: ${password}</li>
  </ul>`;

  // setup email data
  let mailOptions = {
    from: '"Pharma-Soft LTD" doron@pharma-soft.co.il', // sender address
    to: `${process.env.NODE_ENV === "production" ? email : mockEmail}`,
    subject: "חידוש סיסמה",
    html: output,
  };
  // send mail with defined transport object
  sendTransportObject(mailOptions);
}

//##################################
// SEND MAIL WITH TRANSPORT OBJECT
function sendTransportObject(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error("[MAIL] " + error);
      console.log(error);
      return error.response;
    }
    logger.info("Mail was sent");
    console.log("Message sent: %s", info.messageId);
    console.log("Message response %s", info.response);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
}

module.exports = {
  sendConfirmationMail,
  newUserApplication,
  contactForm,
  forgotPassword,
  sendTestMail,
  sendNewPasswordToUser,
};
