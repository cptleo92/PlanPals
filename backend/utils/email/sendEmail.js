const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

require('dotenv').config()

const sendEmail = async (email, subject, payload, template) => {
  try {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })

    const source = fs.readFileSync(path.join(__dirname, template), 'utf8')
    const compiledTemplate = handlebars.compile(source)

    const options = () => {
      return {
        from: 'Leo @ PlanPals <noreply@planpals.com>',
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      }
    }

    // Send email
    transporter.sendMail(options(), (error) => {
      if (error) {
        console.log(error)
        return error
      } else {
        console.log(`Sent mail to: ${email}`)
        return
      }
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = sendEmail