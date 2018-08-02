# SendGrid Stats

SendGrid Stats takes events from the SendGrid event webhook, parses out only the
type of event (processed, deffered, etc.) and uses that to send a metric to a
DatadogStatsD server for monitoring.

## Requirements

- An existing firebase project
- An existing DatadogStatsD collector that accepts outside connections

## Setup

A number of variables need to be added to your Firebase functions config for
this project to work correctly. These can be added by running the following
commands, substituting your own values.

```bash
firebase functions:config:set env=prod
firebase functions:config:set statsd.ip=XXX.XXX.XXX.XXX
firebase functions:config:set statsd.port=8125
```

You also need to create the `.firebaserc` file in the root directory, with the
following contents, again substituting your own value for the project name:

```json
{
  "projects": {
    "prod": "my-project-name"
  }
}
```

Once this is all complete, you should be ready to upload your function and have
it start listening for events. Simply run:

```bash
firebase deploy --only functions
```

and wait for the deployment to complete. This will take a few moments the first
time as all of the APIs are enabled. Once this reports success, you can grab the
public url for your function and use it to setup the event webhook in SendGrid.
You should see metrics start to show up in Datadog as soon as some emails are
sent!
