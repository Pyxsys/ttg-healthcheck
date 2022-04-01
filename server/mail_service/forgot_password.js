const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'pi.health.check@gmail.com', // Change to your recipient
  from: {
    name: "Pi-Health-Check",
    email: "pi.health.check@gmail.com",
  },
  subject: 'Password recovery',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })