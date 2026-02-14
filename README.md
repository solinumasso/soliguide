<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

# Soliguide: useful information for those who need it

Soliguide references all the services, initiatives and resources that are useful for those in need.

## Requirements

- [ ] [NodeJS 20](https://nodejs.org/en/)
- [ ] [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [ ] Docker and Docker compose v2

For the export feature only:

- [ ] [libreoffice](https://fr.libreoffice.org/get-help/install-howto/) required for the library [libroffice-convert](https://www.npmjs.com/package/libreoffice-convert). For PDF export
- [ ] [Lato fonts](https://www.latofonts.com/fr/lato-free-fonts/)

We are (almost) all using VSCode, here's a list of useful plugins:

- Angular Essentials - https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials
- Angular Language Service - https://marketplace.visualstudio.com/items?itemName=Angular.ng-template
- Angular Snippets - https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2
- ESLint https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- Prettier - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

For Windows only:

- You will need to install bash for windows. We recommend using the last ubuntu LTS release. You can find everything you need on the windows store. Basically, it will be used to run the app and use all the scripts.
- For all the files and software, you will use them on Windows. You will have to clone the repo in Windows directory. You can access Windows C directory by going to `/mnt/c`. Then you can clone the repo whereever you want within `/mnt/c`. You can do it by following the further steps.
- You will need to download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and make it work with Bash for Windows. You can check how [this documentation](https://docs.docker.com/desktop/wsl/) to see how to do it.
- Now you can open VSCode and have a WSL shell to run linux commands. You can set this terminal to be the default one in VSCode settings. As well, you can download the Bash For Windows VSCode package.

## Getting Started

This repository is a monorepo managed by [Lerna](https://lerna.js.org/) and [Nx](https://nx.dev/).

1. Clone this repository

   ```bash
   git clone git@github.com:solinumasso/soliguide.git
   ```

2. Install the dependencies

   ```bash
   yarn install --refresh-lockfile
   ```

   > ✌️ Tip: you can define aliases to save time

   ```bash
   alias api='yarn workspace @soliguide/api'
   alias common='yarn workspace @soliguide/common'
   alias common-angular='yarn workspace @soliguide/common-angular'
   alias design-system='yarn workspace @soliguide/design-system'
   alias frontend='yarn workspace @soliguide/frontend'
   alias location-api='yarn workspace @soliguide/location-api'
   alias soligare='yarn workspace @soliguide/soligare'
   alias web-app='yarn workspace @soliguide/web-app'
   alias widget='yarn workspace @soliguide/widget'
   ```

3. Create the `.env` configuration file

   ```bash
   cp packages/api/.env.example packages/api/.env
   ```

4. Start MongoDB in Docker

   ```bash
   docker compose up -d
   ```

5. Import test database content

   ```bash
   ./packages/api/db.sh restore -t
   ```

6. To use the test database, update the value of the `MONGODB_URI` key in `packages/api/.env`

   ```code
   MONGODB_URI=mongodb://127.0.0.1:27017/soliguide_test?replicaSet=rs0
   ```

7. Build common and common-angular

   ```bash
   yarn build --scope @soliguide/common-angular
   ```

8. Start the frontend and backend

   ```bash
   yarn workspace @soliguide/api watch
   yarn workspace @soliguide/frontend start
   ```

You're all set, Soliguide is running!

## Tests

To run the tests:

```bash
yarn test
```

## Database procedures

### Create a new migration

> The test database dump is located in `data/soliguide_db_test.gzip`

Migrations are run before the API starts. To create the migration run:

```bash
yarn workspace @soliguide/api migrate-create __migration-name__
```

Replace `__migration-name__` by the name you want to give to your migration. The migration file will be created in `packages/api/migrations`.

For every migration created, one must apply it to the test database to keep it up-to-date. Once the migration is finalized, run:

```bash
./packages/api/db.sh dump -t
```

It should be noted that when the API is deployed, migrations are executed at runtime. Therefore all the code is transpiled to JS instead of TS, migration files included.
To avoid having to build the api when developing on your local machine, you can run migrations with the TS files. But if you want to run migrations like in production, you can run `yarn build-and-migrate-up`

## Build Docker images

1. Create `.env` file at the project root

   ```bash
   cp .env.example .env
   ```

2. Build the containers

   ```bash
   # Widget
   docker build . -f packages/widget/Dockerfile -t soliguide-widget:local $(for i in `cat .env`; echo $i; do out+="--build-arg $i " ; done; echo $out;out="")
   # Frontend
   docker build . -f packages/frontend/Dockerfile -t soliguide-frontend:local $(for i in `cat .env`; do out+="--build-arg $i " ; done; echo $out;out="")
   # API
   docker build . -f packages/api/Dockerfile -t soliguide-api:local
   # Location API
   docker build . -f packages/location-api/Dockerfile -t soliguide-location-api:local
   ```

3. Run the containers locally

   ```bash
   docker run -d -p 3001:3001 --name=soliguide-api --env-file packages/api/.env soliguide-api:local
   docker run -d -p 3001:3001 --name=soliguide-location-api --env-file packages/location-api/.env soliguide-location-api:local
   docker run -d -p 8080:8080 --name=soliguide-frontend soliguide-frontend:local
   docker run -d -p 8081:8080 --name=soliguide-widget soliguide-widget:local
   ```

4. Add localhost url in your hosts file

- **Windows** => `C:\Windows\system32\drivers\etc\hosts`
- **Ubuntu** => `/etc/hosts`

```
# Solinum
127.0.0.1 dev_local.soliguide.fr
127.0.0.1 dev_local.soliguia.ad
127.0.0.1 dev_local.soliguia.es
```

5. To test in local environnment :

- http://dev_local.soliguide.fr:8080
- http://dev_local.soliguia.es:8080
- http://dev_local.soliguia.ad:8080

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
