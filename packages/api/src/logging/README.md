# Analytics

## Abstract

The main anlytics tool used in Soliguide is [PostHog](https://posthog.com/)

- [Docs](https://posthog.com/docs/libraries/node)
- [Tutorial](https://posthog.com/tutorials/node-express-analytics)
- [GitHub Milestone](https://github.com/solinumasso/soliguide/milestone/13)

## Structure

### Constants

You will find a map with the tracked events.
All trackers must be referenced in [this document](https://www.notion.so/solinum/03ed772ab8d94b719542df959ddd4a5b?v=2ef89d35ee844f7c865091c416b473f7)
We want to keep a history of different trackers, harmonize their names and avoid loss of data

### Types

For the moment a tracked event is basically an action + a feature.

### Services

Dead-simple PostHog class init.

### Deprecated logs

The logs recorded in the database are still used in the Solinum's dashboards.
Pending a migration to switch dashboards on Posthog data, we keep the logs in the data base.
