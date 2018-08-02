const functions = require("firebase-functions")

var StatsD = require("hot-shots"),
  client = new StatsD({
    host: functions.config().statsd.ip,
    port: functions.config().statsd.port,
    globalTags: { env: functions.config().project.env }
  })

exports.sendgridEvent = functions.https.onRequest((req, res) => {
  req.body.forEach((event) => {
    // We send a different Datadog event type for each SendGrid event, allowing
    // us to graph them separately.
    client.increment(`email.${event.event}`, (error) => {
      if (error) {
        console.error("Error sending stats:", error)
      }
    })
  })
  res.status(200).end()
})
