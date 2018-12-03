const functions = require("firebase-functions")
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const db = admin.database()

const StatsD = require("hot-shots")
const client = new StatsD({
  host: functions.config().statsd.ip,
  port: functions.config().statsd.port,
  globalTags: { env: functions.config().project.env },
  errorHandler: (err) => console.error("error during push:", err)
})

exports.sendgridEvent = functions.https.onRequest(async (req, res) => {
  try {
    const promises = req.body.map((event) => {
      const {email, sg_event_id} = event
      const id = encodeEmail(email)
      return db
      .ref(`${id}/events`)
      .child(sg_event_id)
      .set(event)
    })
    await Promise.all(promises)
  } catch(err) {
    console.error(err)
  }

  const events = req.body.map((event) => `email.${event.event}`)
  client.increment(events, (error) => {
    if (error) {
      console.error("Error sending stats:", error)
    } else {
      console.log(`Sent ${events} successfully.`)
    }
    res.status(200).end()
  })
})

function encodeEmail(email) {
  let buff = new Buffer(email)
  let base64data = buff.toString('base64')
  return base64data
}