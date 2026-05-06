# Scripts

Standalone scripts for one-off data operations. Each script connects to MongoDB directly and exits when done.

---

## sync-places.ts

Syncs all `ONLINE` and `OFFLINE` places to Brevo CRM via the custom object batch upsert API (`POST /v3/objects/place/batch/upsert`).

Replaces the n8n workflow that previously consumed RabbitMQ events to perform the same sync.

### Required environment variables

| Variable        | Description                                              |
| --------------- | -------------------------------------------------------- |
| `BREVO_API_KEY` | Brevo API key                                            |
| `MONGODB_URI`   | MongoDB connection string (defaults to local if not set) |

### Usage

**Full sync against production database:**

```bash
MONGODB_URI='mongodb+srv://...' \
BREVO_API_KEY='your_key' \
yarn workspace @soliguide/api sync-places
```

**Test mode — sends only 5 places and logs them before sending:**

```bash
MONGODB_URI='mongodb+srv://...' \
BREVO_API_KEY='your_key' \
yarn workspace @soliguide/api sync-places -- --test
```

### How it works

1. Queries places with status `ONLINE` or `OFFLINE`, paginated by cursor (`_id`) in batches of 5000
2. For each place, joins the `organization` collection via `$lookup` to populate the `organizations` field
3. Builds an `AmqpSynchroAirtablePlaceEvent` per place (same payload format used by the RabbitMQ flow)
4. Maps to the Brevo record format and sends to Brevo in batches of 1000 (API maximum), with 10s between batches
5. Respects Brevo rate limit headers (`x-sib-ratelimit-remaining`, `x-sib-ratelimit-reset`) — waits for quota reset when exhausted, retries on 429 up to 5 times
6. Upserts are matched on `ext_id = place.lieu_id`

Frontend links (`public_site_link`, `update_campaign_link`, `all_places_link`) always use production URLs regardless of the local environment configuration.

---

## sync-users.ts

Syncs all `PRO` and `ADMIN_TERRITORY` users to Airtable by publishing an `AmqpSynchroAirtableUserEvent` per user to the `SYNCHRO_AT` RabbitMQ exchange (routing key `synchro_at.user`).

Replaces a manual re-sync by replaying the same events the application normally emits on user save.

### Required environment variables

| Variable      | Description                                              |
| ------------- | -------------------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string (defaults to local if not set) |
| `RABBITMQ_*`  | RabbitMQ connection variables used by `amqpEventsSender` |

### Usage

**Full sync against production database:**

```bash
MONGODB_URI='mongodb+srv://...' \
yarn workspace @soliguide/api sync:users
```

### How it works

1. Queries users with status `PRO` or `ADMIN_TERRITORY`, paginated by cursor (`_id`) in batches of 5000
2. Fetches `userRights` for each user if not already populated
3. Determines the user's country from `areas` and maps it to the correct theme and production frontend URL
4. Publishes one `AmqpSynchroAirtableUserEvent` per user to RabbitMQ (`SYNCHRO_AT` exchange)
5. Throttles to 50 messages per second to avoid overwhelming the broker

---

## sync-user-place-associations.ts

Associates `PRO` and `ADMIN_TERRITORY` users to their verified places in Brevo CRM via the custom object batch upsert API (`POST /v3/objects/place/batch/upsert`).

For each user, the script looks up their Brevo contact ID by email, then links that contact to every place where they hold a `VERIFIED` right.

### Required environment variables

| Variable        | Description                                              |
| --------------- | -------------------------------------------------------- |
| `BREVO_API_KEY` | Brevo API key                                            |
| `MONGODB_URI`   | MongoDB connection string (defaults to local if not set) |

### Usage

**Full sync against production database:**

```bash
MONGODB_URI='mongodb+srv://...' \
BREVO_API_KEY='your_key' \
yarn workspace @soliguide/api sync:brevo:user-place-associations
```

**Test mode — processes only 5 users:**

```bash
MONGODB_URI='mongodb+srv://...' \
BREVO_API_KEY='your_key' \
yarn workspace @soliguide/api sync:brevo:user-place-associations:test
```

### Resuming after interruption

The script writes a checkpoint to `/tmp/sync-brevo-places-checkpoint.txt` after each DB page. If the script is interrupted, re-running it will resume from the last checkpoint automatically. The checkpoint file is cleared on successful completion.

### How it works

1. Queries users with status `PRO` or `ADMIN_TERRITORY`, paginated by cursor (`_id`) in batches of 1000
2. Fetches `userRights` for each user (populated via `DEFAULT_USER_POPULATE`, or fetched separately if missing)
3. Filters users to those with at least one `VERIFIED` place right and a known email address
4. Resolves Brevo contact IDs by email in parallel (10 concurrent requests), with an in-memory cache to avoid redundant lookups
5. Groups contact IDs by `place_id`, then builds association records (Brevo limits 10 contacts per record — records are split accordingly)
6. Sends association records to Brevo in chunks of 1000 (API maximum), with 2s between batches
7. Respects Brevo rate limit headers (`x-sib-ratelimit-remaining`, `x-sib-ratelimit-reset`) — waits for quota reset when exhausted, retries on 429/5xx up to 5 times
