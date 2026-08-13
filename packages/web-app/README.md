# Web-app

This project was generated with [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

This app is the new frontend _(wip)_ for Soliguide.

## Installation and development server

Once you've cloned the repository and installed dependencies with `yarn`, start a development server:

```bash
# Then navigate to `http://localhost:5173`.
yarn dev

# or start the server and open the app in a new browser tab
yarn dev -- --open
```

The app live reloads as sources change.

You can use `yarn watch` as an alias.

## Country themes

One deployment serves every country. The theme (brand, languages, taxonomy,
legal links, available features, illustrations) is resolved **per request from
the public hostname**, in `src/hooks.server.ts`, and handed to components through
`src/routes/+layout.server.ts`.

Each theme declares the hostnames it answers on in a comma-separated environment
variable named after its `Themes` enum value:

```
PUBLIC_SOLIGUIDE_FR_HOSTNAMES=fr.localhost,localhost
PUBLIC_SOLIGUIA_ES_HOSTNAMES=es.localhost
PUBLIC_SOLIGUIA_AD_HOSTNAMES=ad.localhost
```

The scheme, the port and a `www.` prefix are ignored. An unmapped hostname logs a
warning and falls back to the French theme, so preview URLs keep working.

The **first** hostname of a list is special: it is the origin sent to the API,
which derives the country of a request from it. Since the API compares hostnames
only and ignores ports, every country needs a distinct one. That is why France
declares `fr.localhost` first: a bare `localhost` would collide with the Angular
frontends, which all run on `localhost` too, and requests would be resolved as
Andorra.

### Running a country locally

`*.localhost` resolves to `127.0.0.1` on every supported platform, so **one dev
server serves every country** and there is nothing to add to `/etc/hosts`:

```bash
yarn dev

#   http://localhost:5173     -> Soliguide, 11 languages, French
#   http://es.localhost:5173  -> Soliguia,   7 languages, Catalan
#   http://ad.localhost:5173  -> Soliguia,   7 languages, Catalan
```

One script per country is available too, which opens the browser straight on the
right hostname, the same way the Angular frontend has `start` / `start:es` /
`start:ad`:

```bash
yarn dev:fr   # opens http://localhost:5173
yarn dev:es   # opens http://es.localhost:5173
yarn dev:ad   # opens http://ad.localhost:5173
```

Unlike the frontend, these are not three different builds on three ports: there
is a single build and a single server, and the hostname alone selects the
country. Switching country is just a matter of changing the URL.

For the **API** to answer with the right country's taxonomy and language, its own
`.env` has to know these origins:

```
WEBAPP_FR_URL=https://fr.localhost
WEBAPP_ES_URL=https://es.localhost
WEBAPP_AD_URL=https://ad.localhost
```

Without them, the theme still applies (brand, languages, links, illustrations all
come from the web-app), but the categories returned by the API stay French.

To boot the whole stack (API, location API and web-app) for one country, use the
root scripts:

```bash
yarn dev:web-app      # France
yarn dev:web-app:es   # Spain
yarn dev:web-app:ad   # Andorra
```

Local hostnames have to be listed in `server.allowedHosts` in `vite.config.ts`,
which the three above already are.

To exercise the production path instead, which reads `X-Forwarded-Host` exactly
as the Clever Cloud edge sets it, no `/etc/hosts` entry is needed:

```bash
yarn build
HOST_HEADER=x-forwarded-host PROTOCOL_HEADER=x-forwarded-proto PORT=3000 node build

curl -s -H 'X-Forwarded-Host: app.soliguia.es' localhost:3000/languages | grep '<html'
```

### Adding a country

1. Add the value to `Themes` in `@soliguide/common`.
2. Add its entries to `BRAND_NAME_BY_THEME`, `WEBSITE_URL_BY_THEME`,
   `LEGAL_PAGE_SLUGS_BY_THEME` and `SUPPORTED_LANGUAGES_BY_COUNTRY`, all in
   `@soliguide/common`.
3. Add one entry to `THEME_BLUEPRINTS` in `src/lib/theme/blueprints.ts`.
4. Add one asset directory under `static/images/themes/`, see its `README.md`.
5. Set the `PUBLIC_<THEME>_HOSTNAMES` variable, attach the domain to the
   deployment, and set the matching `WEBAPP_*_URL` on the API.

No component, matcher or link table has to change.

### Deployment checklist

- Attach every country domain to the **same** application. There is one build and
  one deployment for all countries.
- Set the `PUBLIC_*_HOSTNAMES` variables to the public hostnames of the
  environment.
- Set `HOST_HEADER=x-forwarded-host` and `PROTOCOL_HEADER=x-forwarded-proto`.
- **Leave `ORIGIN` unset.** `adapter-node` pins `url.origin` to it, and while the
  theme itself reads the headers directly, a pinned origin breaks SvelteKit's own
  URL handling.
- On the API, set `WEBAPP_FR_URL`, `WEBAPP_ES_URL` and `WEBAPP_AD_URL` to the
  first hostname of each `PUBLIC_*_HOSTNAMES` list. The API derives the country
  of a request from its `Origin` header, and the web-app sends that canonical
  origin so alias hostnames resolve to the right country too.

## Build and preview

To create a production version of the app:

```bash
yarn build
```

You can preview the production build locally with `yarn preview`.

To create a production version and run it locally with `yarn start`.

## Test

You can run integration tests (using Playwright) with `yarn test:integration`.

You can run unit tests (using vitest) with `yarn test:unit`.

Both tests are run when using `yarn test`.

_Note: Unit tests run in watch mode when launched locally. This feature is disabled when running in the CI.
You can run unit tests without watch mode by issuing this command : `yarn vitest run`._

## Type checking

This app is written in JavaScript but uses Typescript as a type-checker. Types are declared in JSDoc.

To check type-safety throughout the app, run `yarn check` or `yarn check:watch` to have it in watch-mode.
