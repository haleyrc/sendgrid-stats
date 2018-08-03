const functions = require("firebase-functions")

var StatsD = require("hot-shots"),
  client = new StatsD({
    host: functions.config().statsd.ip,
    port: functions.config().statsd.port,
    globalTags: { env: functions.config().project.env },
    errorHandler: (err) => console.error("error during push:", err)
  })

exports.sendgridEvent = functions.https.onRequest((req, res) => {
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
