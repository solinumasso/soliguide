# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.125.0](https://github.com/solinumasso/soliguide/compare/v4.124.0...v4.125.0) (2026-02-18)


### Bug Fixes

* **api:** delete deepsource test & license step ([e44c4b4](https://github.com/solinumasso/soliguide/commit/e44c4b48bec7014c91166d4877b58a8e81be4e5b))
* **api:** fix ci ([b77ee01](https://github.com/solinumasso/soliguide/commit/b77ee01034e5f9b4b8235639febcb674ebbfcba5))
* **api:** fix contact ([7c84e3a](https://github.com/solinumasso/soliguide/commit/7c84e3a23c03d5a44cba5b1342fd84c017d52758))
* **api:** fix deployment ([cb617b6](https://github.com/solinumasso/soliguide/commit/cb617b6e6551d5a95b3f8a1604d6ef25f4581201))
* **api:** fix params of search autocomplete ([347777a](https://github.com/solinumasso/soliguide/commit/347777ac76140f3f703ca86756e582fe1e4d7fc4))
* **api:** fix yarn ([3066f61](https://github.com/solinumasso/soliguide/commit/3066f61c72738466a5838639eacddc8f265f4379))
* **api:** update transport label, & fix github issues ([fd718c5](https://github.com/solinumasso/soliguide/commit/fd718c57cc94eaa03b55218043423f798538a6a6))
* **ci:** refactor claude workflow for reliable PR reviews ([#1163](https://github.com/solinumasso/soliguide/issues/1163)) ([86bd16a](https://github.com/solinumasso/soliguide/commit/86bd16a393a5cee0c7b4d69a1a0c0652ed101683))
* **ci:** restore issue_comment trigger for claude workflow ([#1164](https://github.com/solinumasso/soliguide/issues/1164)) ([dea0631](https://github.com/solinumasso/soliguide/commit/dea06312ab4e4ea254115b03161bd293f6a53688))
* **ci:** revert to HEAD:master for Clever Cloud deployment ([ac4d5e4](https://github.com/solinumasso/soliguide/commit/ac4d5e4efb42c793b3658b98970763625591506b))
* **common:** clean repo ([7270eab](https://github.com/solinumasso/soliguide/commit/7270eab2d7b7ad22df9572abf88ebcd3f54ed169))
* **common:** update packages, update types, restore dockerfile ([54a7328](https://github.com/solinumasso/soliguide/commit/54a73283496e89ce15b4260a101b4e50589b905f))
* **docker:** copy yarn releases directory to build context ([b07011b](https://github.com/solinumasso/soliguide/commit/b07011b1368998e34623fd8e61539d13f30e11d0))
* **frontend:** add caddy ([58662c6](https://github.com/solinumasso/soliguide/commit/58662c609dfce527266c45e39f767f40c27cc496))
* **frontend:** add caddy ([13991c4](https://github.com/solinumasso/soliguide/commit/13991c4a00aa00db87a821faf66ec444f1f8fdba))
* **frontend:** fix & resync search suggestions ([80c2932](https://github.com/solinumasso/soliguide/commit/80c293262b6a64a42b1c0e7de677c17169f06166))
* **frontend:** fix & resync search suggestions ([2dc3372](https://github.com/solinumasso/soliguide/commit/2dc33728d6423f7fe56cb35a63d3ef326478f00c))
* **frontend:** fix caddy ([fc0153f](https://github.com/solinumasso/soliguide/commit/fc0153f7d167926f1141a43af2ea2e22930baf59))
* **frontend:** fix date of last login ([f4bd0dd](https://github.com/solinumasso/soliguide/commit/f4bd0dd034a079e591a931e1a26ca00eeca207a3))
* **frontend:** fix unit tests ([b32ec25](https://github.com/solinumasso/soliguide/commit/b32ec25528bbb6f8bb6810f2131037bc4807553d))
* **frontend:** lint ([445b6cd](https://github.com/solinumasso/soliguide/commit/445b6cdd8a6a6f3b768a442da0164619d4e149b5))


### Features

* **api:** add contact for for spain and andorra and move to brevo ([#1137](https://github.com/solinumasso/soliguide/issues/1137)) ([1e10dd8](https://github.com/solinumasso/soliguide/commit/1e10dd83dcd8385d3bba3adf78245fc5cd923fb7))
* **api:** ajout du champ lastLogin dans UserForAuth ([3f1dca8](https://github.com/solinumasso/soliguide/commit/3f1dca81131650f4c6c204ef5832ea0f726cf07b))
* **frontend:** add Last Login ([5e9788c](https://github.com/solinumasso/soliguide/commit/5e9788c62a26a44385842956f6dbdf2fee0fc1dc))
* **frontend:** fix translation for type label ([#1170](https://github.com/solinumasso/soliguide/issues/1170)) ([1339573](https://github.com/solinumasso/soliguide/commit/1339573056a827342b6dde4e9151983f6d63195b))
* implement new mobility taxonomy ([#1057](https://github.com/solinumasso/soliguide/issues/1057)) ([d60291d](https://github.com/solinumasso/soliguide/commit/d60291d58652466fa95614fa86c1b67b920faaa7))
* **web-app:** ajout d'une bannière d'annonce pour la fonctionnalité favoris ([573cb81](https://github.com/solinumasso/soliguide/commit/573cb81838f32308f623881f0de8b05139fd21cc))
* **webapp:** delete storybook ([#1166](https://github.com/solinumasso/soliguide/issues/1166)) ([aeea35a](https://github.com/solinumasso/soliguide/commit/aeea35a18339b9967c631b7b0182e4856e1e85c3))





# [4.124.0](https://github.com/solinumasso/soliguide/compare/v4.123.0...v4.124.0) (2026-02-11)


### Bug Fixes

* **ci:** disable npm publish in semantic-release-lerna ([31e0f7d](https://github.com/solinumasso/soliguide/commit/31e0f7d7a91878332f7cad29e0783ee8cc13351b))
* **ci:** install dependencies with yarn before semantic-release ([d60ebe6](https://github.com/solinumasso/soliguide/commit/d60ebe641c1cfef131ae2a277d4987141d5e128f))
* **ci:** replace semantic-release-lerna with @semantic-release/exec ([897aab4](https://github.com/solinumasso/soliguide/commit/897aab435c51eda0127764f57b9af8e19c9a91a3))
* **web-app:** tracking on more info button ([da1ad3c](https://github.com/solinumasso/soliguide/commit/da1ad3c28652b924170e10ed048c1822c0a08e71))


### Features

* add lastLogin for users and their orgas ([#1100](https://github.com/solinumasso/soliguide/issues/1100)) ([6c86009](https://github.com/solinumasso/soliguide/commit/6c86009d5b0ba3722f41a422b886dec1c4472f6e))
* **api:** add healthcheck for api and version to location-api health… ([#1125](https://github.com/solinumasso/soliguide/issues/1125)) ([bd8f239](https://github.com/solinumasso/soliguide/commit/bd8f239703d66d7882a07d445d4c7a93473d6def))
* **frontend:** add css tracking ([66784ec](https://github.com/solinumasso/soliguide/commit/66784eca88194f1cda9d0aec0107a1c138e4e10c))





## 1.9.42 (2021-09-30)

### Bug Fixes

- **test:** corrige un test en remplaçant les toBeTruthy par des toBe(true) ([4139ef2](https://github.com/solinumasso/soliguide/commit/4139ef2f12cf0395ede78dbe68a8edf91f8e7435))

## 1.9.41 (2021-09-27)

**Note:** Version bump only for package soliguide

## 1.9.40 (2021-09-23)

### Bug Fixes

- **script:** corrige le script compte créé avec le nouveau modèle de .env ([b47d331](https://github.com/solinumasso/soliguide/commit/b47d331286d79fe362886fba17fb33fcffbb8b82))

## 1.9.39 (2021-09-22)

**Note:** Version bump only for package soliguide

## 1.9.38 (2021-09-21)

**Note:** Version bump only for package soliguide

## 1.9.37 (2021-09-21)

**Note:** Version bump only for package soliguide

## 1.9.36 (2021-09-21)

**Note:** Version bump only for package soliguide

## 1.9.35 (2021-09-21)

**Note:** Version bump only for package soliguide

## 1.9.34 (2021-09-21)

**Note:** Version bump only for package soliguide

## 1.9.33 (2021-09-20)

**Note:** Version bump only for package soliguide

## 1.9.32 (2021-09-20)

**Note:** Version bump only for package soliguide

## 1.9.31 (2021-09-17)

### Bug Fixes

- tests ([f7fb74a](https://github.com/solinumasso/soliguide/commit/f7fb74a1237e3e19916f0514717183313e5b1ad8))

## 1.9.30 (2021-09-16)

**Note:** Version bump only for package soliguide

## 1.9.29 (2021-09-15)

**Note:** Version bump only for package soliguide

## 1.9.28 (2021-09-13)

**Note:** Version bump only for package soliguide

## 1.9.27 (2021-09-09)

**Note:** Version bump only for package soliguide

## 1.9.26 (2021-09-09)

**Note:** Version bump only for package soliguide

## 1.9.25 (2021-09-08)

**Note:** Version bump only for package soliguide

## 1.9.24 (2021-09-07)

**Note:** Version bump only for package soliguide

## 1.9.23 (2021-09-07)

**Note:** Version bump only for package soliguide

## 1.9.22 (2021-09-01)

### Bug Fixes

- CI import ([0f15a43](https://github.com/solinumasso/soliguide/commit/0f15a43cf9587ac11dc294298f119f2086cd60e8))

## 1.9.21 (2021-08-17)

### Bug Fixes

- css for Lorène ([c7e97dd](https://github.com/solinumasso/soliguide/commit/c7e97dd1401d257d363843bdbe0b1d6dd3456211))

## 1.9.20 (2021-08-09)

**Note:** Version bump only for package soliguide

## 1.9.19 (2021-07-20)

**Note:** Version bump only for package soliguide

## 1.9.18 (2021-07-02)

**Note:** Version bump only for package soliguide

## 1.9.17 (2021-06-30)

**Note:** Version bump only for package soliguide

## 1.9.16 (2021-06-28)

**Note:** Version bump only for package soliguide

## 1.9.15 (2021-06-27)

**Note:** Version bump only for package soliguide

## 1.9.14 (2021-06-20)

### Bug Fixes

- console log ([1fdb6e3](https://github.com/solinumasso/soliguide/commit/1fdb6e3aebdd6d8f6da5b2a97c788d2c46e88af5))

## 1.9.13 (2021-06-16)

### Bug Fixes

- prod package ([3261ea7](https://github.com/solinumasso/soliguide/commit/3261ea73955af3daadd55da4ad14b0462578da98))

## 1.9.12 (2021-06-16)

**Note:** Version bump only for package soliguide

## 1.9.11 (2021-06-16)

**Note:** Version bump only for package soliguide

## 1.9.10 (2021-06-16)

### Bug Fixes

- services ouvertures ([0338f29](https://github.com/solinumasso/soliguide/commit/0338f299db6b557c7614adcc475688d0ed6e2714))

## 1.9.9 (2021-06-15)

**Note:** Version bump only for package soliguide

## 1.9.8 (2021-06-11)

**Note:** Version bump only for package soliguide

## 1.9.7 (2021-06-10)

### Bug Fixes

- affichage des emails ([e3194b4](https://github.com/solinumasso/soliguide/commit/e3194b484ca78c6ba82cf9dd1069388dc5be9516))

## 1.9.6 (2021-06-10)

**Note:** Version bump only for package soliguide

## 1.9.5 (2021-06-01)

### Bug Fixes

- **admin-search:** déplace les filtres de fermeture et de statut pour les fiches que si la personne n'est pas admin ([e34fa2e](https://github.com/solinumasso/soliguide/commit/e34fa2ea8fa7947bd342c3f353f6ec1a328d75a9))

## 1.9.4 (2021-05-25)

**Note:** Version bump only for package soliguide

## 1.9.3 (2021-05-20)

**Note:** Version bump only for package soliguide

## 1.9.2 (2021-05-01)

### Bug Fixes

- **users:** page partenaires de nouveau fonctionnelle ([bc8e568](https://github.com/solinumasso/soliguide/commit/bc8e5680daaff9b6836bb52ee0a3b78cf4a1b58c))

## 1.9.1 (2021-05-01)

### Bug Fixes

- **ci:** username ([de0a02c](https://github.com/solinumasso/soliguide/commit/de0a02c77c2b7534ec53f173279cd2a294035fa9))

# [1.9.0](https://github.com/solinumasso/soliguide/compare/v1.8.0...v1.9.0) (2021-04-30)

### Bug Fixes

- **api:** correction de fautes ([8c072aa](https://github.com/solinumasso/soliguide/commit/8c072aaf7fbaa943135c91231e6c4fdd9f532099))
- **ci:** ajout d'un envoi des tests ([0751588](https://github.com/solinumasso/soliguide/commit/0751588111dc020cc5703e5a3f673c3d9fc80433))
- **ci:** ajout de la DB de test ([c2f04e1](https://github.com/solinumasso/soliguide/commit/c2f04e1e130963ae4e046f8d07fa7e903f6cc141))
- **ci:** ajout du dotenv ([504bd8f](https://github.com/solinumasso/soliguide/commit/504bd8ff93503ea64ca3dcc751148d008ba3b622))
- **ci:** ajout du frontend test ([a1aaa54](https://github.com/solinumasso/soliguide/commit/a1aaa5486194b30ce220f98681fed3b753e4e67f))
- **ci:** check du build OK ([1445065](https://github.com/solinumasso/soliguide/commit/1445065411943c3f95c8cb68ed062399249fa01c))
- **ci:** codecov ([3564b6b](https://github.com/solinumasso/soliguide/commit/3564b6b9f9effd1b5e5ee077fc8f13e24af3543d))
- **ci:** codecov ([de5abb2](https://github.com/solinumasso/soliguide/commit/de5abb2e399ef19eadd426243097b5041168c132))
- **ci:** test envoyés à CodeCov opérationnels ([3b52d26](https://github.com/solinumasso/soliguide/commit/3b52d26851986d705a90eb09917fad013dd2a062))
- **CI:** ajout d'une étape de lancement de l'API + test ([4511cc5](https://github.com/solinumasso/soliguide/commit/4511cc5cff1fd8fe20511a59aa8e4d020d5aff03))
- **db:** suppression de données obsolètes via une migration ([4bd4d2f](https://github.com/solinumasso/soliguide/commit/4bd4d2f31db4cc35702216e9a1f0b8fe1b69354b))
- **delete-place:** suppression d'une place ([ea7f6d3](https://github.com/solinumasso/soliguide/commit/ea7f6d3ac8e4abb755cca2c49920bb8d8c8a2b4d))
- **design:** ajustementn des filtres sur la page de recherche ([ad3cb64](https://github.com/solinumasso/soliguide/commit/ad3cb64c1d7c17fa599444db9447350a737caac7))
- **lint:** correction d'un bug ([3c7c129](https://github.com/solinumasso/soliguide/commit/3c7c12921911be02fe5565590182f979659f162f))
- **place:** suppression de la saturation des lieux ([9b2be84](https://github.com/solinumasso/soliguide/commit/9b2be84832df5cd99cd3a4bc71a78aa235323dcb))
- **tests:** plus qu'un test youpi ([f7c5176](https://github.com/solinumasso/soliguide/commit/f7c5176b2782158b03f9a5fc8a46824783495edf))
- **tests:** test de delete place ([ca31367](https://github.com/solinumasso/soliguide/commit/ca31367c4cf5477f875b648f416b6a2c66fc7fe5))
- correction des bugs à l'inscription ([9e2d661](https://github.com/solinumasso/soliguide/commit/9e2d661955f7032541ab3e6f0774beb2d99cc285))
- use DTO to check mail ([2b4534b](https://github.com/solinumasso/soliguide/commit/2b4534b8763fcb408a19a7b293338dddd98a10bb))
- **packages:** mise à jour des packages ([c81cb02](https://github.com/solinumasso/soliguide/commit/c81cb0280d30171164105aee37d03735d4d93a8c))
- **search:** tests frontend ([d437d14](https://github.com/solinumasso/soliguide/commit/d437d142478b93160cab64a94f76ac3b23bcbed4))
- **tests:** ajout de tests sur l'API ([7e84ee8](https://github.com/solinumasso/soliguide/commit/7e84ee87a451d5c3dcf1f2b643548e7716cb1390))
- **tests:** mise à jour des tests ([ae1fdaf](https://github.com/solinumasso/soliguide/commit/ae1fdaf6aebc2fa5267d4dcc21a13a468b0717b5))
- **tests:** search + place OK ([79c88fe](https://github.com/solinumasso/soliguide/commit/79c88fe37ef7f7a4a7fea70fe91c2ea828fdec89))

### Features

- **scripts:** ajout de scripts pour importer / exporter des DB de test et de PROD ([750a762](https://github.com/solinumasso/soliguide/commit/750a7624a603cae8c735c809157edce3be238290))
- **tests:** ajout de test sur des services de l'API ([30496ed](https://github.com/solinumasso/soliguide/commit/30496ed0b98d79177ffce47346dd0587f69bfeb3))

# [1.8.0](https://github.com/solinumasso/soliguide/compare/v1.7.0...v1.8.0) (2021-04-26)

### Bug Fixes

- **autocomplete:** correction d'un bug sur le survol du champs ([ef6731c](https://github.com/solinumasso/soliguide/commit/ef6731c9fd9fa38e4401dc74a1d5aa6ba776db3a))
- **autocomplete:** corrige l'erreur qui empèche la recherche par mot clé ([e6d5389](https://github.com/solinumasso/soliguide/commit/e6d5389cd31b189023a7e300e8d63399a809e4bc))
- **autocomplete:** enlève la suggestion de synonyme pour les mots-clé de l'input ([d811474](https://github.com/solinumasso/soliguide/commit/d811474c5cbdb8f05fa6217e3e66e3ac49af28ec))
- **crisp-not-appearing:** ajoute l'image du chat crisp en svg ([4ac577c](https://github.com/solinumasso/soliguide/commit/4ac577c03144d9b022a7ea942181f24f091aeee1))
- **crisp-not-appearing:** applique le css au niveau du lien pour que toute l'icone soit cliquable ([6c9a4c8](https://github.com/solinumasso/soliguide/commit/6c9a4c834a72611d48922ce8260a1f2a91d18323))
- **crisp-not-appearing:** création d'un bouton de chat pour les gens qui ont refusé les cookies ([6cd01d1](https://github.com/solinumasso/soliguide/commit/6cd01d1e373363509d02ac1ee80564462daf9508))
- **crisp-not-appearing:** implémente le CSS pour que le dummy chat soit le même que le vrai chat crisp ([5c9b2f3](https://github.com/solinumasso/soliguide/commit/5c9b2f331532407f046327b97e8803321a06a3a7))
- **form-place:** enlève des imports inutiles dans le menu.component ([4552319](https://github.com/solinumasso/soliguide/commit/455231979787fc1a3cf9e0867d854985ef2704ce))
- **form-place:** implémente des tests fonctionels pour closed.component ([15a50b0](https://github.com/solinumasso/soliguide/commit/15a50b04819a6c9b9d6fb246a307fe35deebdc4d))
- **form-place:** implémente des tests fonctionels pour form-horaires.component ([181a7cd](https://github.com/solinumasso/soliguide/commit/181a7cd21843df941dafc24efef3578b0eb18e63))
- **form-place:** implémente des tests fonctionels pour horaires-form-table.component ([0845a17](https://github.com/solinumasso/soliguide/commit/0845a17d7a705ff2cc92ada3d138f0096a44eff4))
- **form-place:** implémente des tests fonctionels pour menu.component ([c8b4773](https://github.com/solinumasso/soliguide/commit/c8b4773778c6796ad1bc3319be9731fc16ad48ef))
- **general:** gitignore + lint + suppression du bandeau ([50fca71](https://github.com/solinumasso/soliguide/commit/50fca71fc190d8f3ea6ad0c36329e13bffc75e5f))
- **invite:** corrige le bug qui n'associait pas les users avec leurs orgas ([8e1c7ed](https://github.com/solinumasso/soliguide/commit/8e1c7ed73ff51cd8eab8d80d325190b8a37e1613))
- **labels:** fautes et corrections de langue ([05168b3](https://github.com/solinumasso/soliguide/commit/05168b3d7ac67b99bbdecfc6727f11eb6f95416a))
- **migration-synonyme:** change l'initialisation des mots-clés de 0 à null au niveau des categorieId pendant la migration ([4effba7](https://github.com/solinumasso/soliguide/commit/4effba72de2d0efa5f0bc79eba886f828d3d1541))
- **place:** corrige l'affichage des services pour les structures avec un seul service ([fe341a0](https://github.com/solinumasso/soliguide/commit/fe341a0968795a4a1d2e41e1329f47518ff8d836))
- **place-creation:** corrige le bug qui ne renvoyait pas la nouvelle place si l'user n'était pas admin ([75fba2c](https://github.com/solinumasso/soliguide/commit/75fba2cce6b3ec0abe739da82b9660ca12647ac2))
- **pwd:** ajoute un scope public à une variable qui manquait ([2bf478f](https://github.com/solinumasso/soliguide/commit/2bf478f841357c30b43ee8d3e29c3c973c969f9c))
- **role:** correction de plusieurs bugs ([086c9fa](https://github.com/solinumasso/soliguide/commit/086c9fa6fcb95da6b65790bff98a81e4c9150898))
- **role:** corrige le lien vers l'invitation de membre dans le modal ([63a81e9](https://github.com/solinumasso/soliguide/commit/63a81e93c144fb0ba9e1eefefad7ed3bd51ec8a1))
- **role:** enlève la possibilité de changer son rôle au niveau du front ([2eb421d](https://github.com/solinumasso/soliguide/commit/2eb421dd59b7c3cd306f874758b1f1642e21c1b1))
- **search:** correction de la fonction recherche pour prendre en compte les tirets ([3101432](https://github.com/solinumasso/soliguide/commit/3101432ea15915beecce2138830b3c8b921aade8))
- **search:** correction des bugs de recherche ([cda4831](https://github.com/solinumasso/soliguide/commit/cda4831a2d69eddccd876688cf751921897c43a2))
- **tests:** mise à jour des tests sur le Search ([e2682bf](https://github.com/solinumasso/soliguide/commit/e2682bfac4c96d55892114268096b1d9c9e85b64))
- **traductions:** nouveaux mots ([d053b5d](https://github.com/solinumasso/soliguide/commit/d053b5d9a2fe4f19fe07bf884c32ebf6a42e5dc0))
- lint ([bd8974c](https://github.com/solinumasso/soliguide/commit/bd8974c707a80c6da4a1fe3a30041fe705361447))
- **users:** implémente des tests fonctionels pour auth.service ([4258dc9](https://github.com/solinumasso/soliguide/commit/4258dc948c5ab5cda6fbcbd5dd2eeca65f244880))
- **users:** implémente des tests fonctionels pour forgot-pwd.component ([e1f1fce](https://github.com/solinumasso/soliguide/commit/e1f1fce7eaf1e58c12620ab2233cd74cef61150e))
- **users:** implémente des tests fonctionels pour invitation.component ([9834544](https://github.com/solinumasso/soliguide/commit/9834544d7e912276c200e08c3c05261c3ceb52d1))
- **users:** implémente des tests fonctionels pour myaccount.component ([15afd32](https://github.com/solinumasso/soliguide/commit/15afd32aaa2d89fcbd6bc2b3b22b64a05c2e1d57))
- **users:** implémente des tests fonctionels pour pwd.component ([32640c8](https://github.com/solinumasso/soliguide/commit/32640c8ba2c696db1e273095c318b6b3987a9e10))
- **users:** implémente des tests fonctionels pour update-infos.component ([21b3392](https://github.com/solinumasso/soliguide/commit/21b33922338fa1f6d4562d94a59f23f5bdd60914))
- **users:** implémente des tests fonctionels pour validate.component ([eda380f](https://github.com/solinumasso/soliguide/commit/eda380f43a02de34d3dc375ed690f3657bc00340))
- **users:** implémente des tests fonctionels pour validate.component ([79a69be](https://github.com/solinumasso/soliguide/commit/79a69be4278526149523e3801ac5a19602666cf1))
- tslint format ([2420ef5](https://github.com/solinumasso/soliguide/commit/2420ef59d298dc26c9b8fd21a5d797d075966b19))

### Features

- **autocomplete:** ajout de l'import automatique du Excel des catégories ([9994d63](https://github.com/solinumasso/soliguide/commit/9994d639ae67a940396c1e275b870cec3e000a5e))
- **autocomplete:** prise en compte de la recherche d'expressions suggérés ([6f4d2e0](https://github.com/solinumasso/soliguide/commit/6f4d2e085da216f99d28939a8a148a4e1317b84c))
- **crisp:** ajout d'un service pour gérer crisp partout dans le projet ([a4bb839](https://github.com/solinumasso/soliguide/commit/a4bb8397239d24752b2520460c3e3e52b7984227))
- **crisp-not-appearing:** corrige le cookie de crips vers crisp et ajoute une fonction qui est executé réguièrement pour checker les cookies ([282c3f6](https://github.com/solinumasso/soliguide/commit/282c3f6a8517c425b5e53174a7d1fa7bf826053c))
- **home:** correction des liens sur la HomePage ([c35b1ed](https://github.com/solinumasso/soliguide/commit/c35b1ed029606b486d4f455f16509be69e286dbb))
- **orga:** création d'un component pour les utilisateurs qui ne sont plus dans les orgas ([ed83b40](https://github.com/solinumasso/soliguide/commit/ed83b40fc2d1ef072d9daf86857dd37dda3593a0))
- **role:** ajoute une phrase dans l'edition des roles si aucun ou un seul collaborateur ([f64c47f](https://github.com/solinumasso/soliguide/commit/f64c47f368985e5d1417f69b64a34e53f8c9a76a))
- **role:** empêche la màj de son rôle si on est le seul admin d'une orga ([c44452c](https://github.com/solinumasso/soliguide/commit/c44452caf40a9647adaff45e98fb8b6f74e5a3c9))
- **role:** retire le CTA pour modifier les rôles si aucun collaborateur ([e52af1b](https://github.com/solinumasso/soliguide/commit/e52af1bac9759c6812d3bbffeb6dd813f4b1624a))
- **script:** ajout du script python pour l'update d'orga via Airtable ([f6c3f16](https://github.com/solinumasso/soliguide/commit/f6c3f1601860551b475cc4f7c363f11165caa6bf))
- **script:** ajoute un script de mise à jour des orgas sur Airtable ([e138817](https://github.com/solinumasso/soliguide/commit/e138817364262954b5069bb55e75888fcca6dcff))
- **sentry:** ajout des infos utilisateurs sur le frontend ([de4f340](https://github.com/solinumasso/soliguide/commit/de4f3403bab7ac5b6e9fc06c4770b7d241965a44))

### Performance Improvements

- **images:** compression des images ([afe3a24](https://github.com/solinumasso/soliguide/commit/afe3a2472c2cfadb241cbd4445c2103a750d9cd6))

# [1.7.0](https://github.com/solinumasso/soliguide/compare/v1.6.2...v1.7.0) (2021-04-13)

### Bug Fixes

- **admin-search:** ajout des coordonnées au DTO ([527461a](https://github.com/solinumasso/soliguide/commit/527461aed7a3edc7b4135dc2f5880e45ff383e09))
- **admin-search:** correction de l'affichage des filtres ([6193e87](https://github.com/solinumasso/soliguide/commit/6193e877e0cc43b5d27714953fd8530c01a93cde))
- **admin-search:** correction des reset de filtres ([d161d34](https://github.com/solinumasso/soliguide/commit/d161d3461896359c7a446cd3440b276efe571453))
- **admin-search:** correction des reset de filtres ([22b7e67](https://github.com/solinumasso/soliguide/commit/22b7e672d107bd120aa16b6661cde7c0eff67b3c))
- **css:** correction des retours ([38f6420](https://github.com/solinumasso/soliguide/commit/38f6420fdac35987256c1b31612976d0e2a70481))
- **front-api-token:** fix le problème de typage de l'id envoyé à l'api pour générer le token ([d2f214a](https://github.com/solinumasso/soliguide/commit/d2f214afad7ce6167989789cc682c6a0cf291f56))
- **general:** Coquille ([51b4a9d](https://github.com/solinumasso/soliguide/commit/51b4a9dd9d4c802dd24b577b2b8436526a417ee5))
- **language:** corrige la faute d'orthographe d'espagnol ([2b5f6f5](https://github.com/solinumasso/soliguide/commit/2b5f6f50fc8c733fe23a92017fac9febfea9afce))
- **logs:** suppression des logs inutiles ([279d182](https://github.com/solinumasso/soliguide/commit/279d182e1405047e9a649c5580d696970a3d5ea4))
- **logs:** suppression des logs inutiles ([ce5f2f2](https://github.com/solinumasso/soliguide/commit/ce5f2f2c196727de29c2e52e71242da1d1424345))
- **search:** dto ([1cc185e](https://github.com/solinumasso/soliguide/commit/1cc185e9341219b95f591f1b51c822577657ae82))
- **search-place:** défini la page de base à 1 pour être cohérent avec le front ([1d3049a](https://github.com/solinumasso/soliguide/commit/1d3049a0cfc31022dd3c95e8fa3bd3a58d8008f8))
- **user_services:** Corrige le bug des UserObjectId qui n'était pas converti en \_id ([579e603](https://github.com/solinumasso/soliguide/commit/579e60378dffcaa2b9cdb5b395a00be1d2fe5eac))
- remove data export ([76a50c3](https://github.com/solinumasso/soliguide/commit/76a50c3e682e9a4750f934148634a525903720b6))

### Features

- **admin-search:** ajout de la limite de résultat par page ([e03bb52](https://github.com/solinumasso/soliguide/commit/e03bb524025bf32daa899b00ee7b2c29c68e2038))
- **admin-search:** ajout de la limite de résultat par page ([752ac03](https://github.com/solinumasso/soliguide/commit/752ac03a43f19c437d3860ac82013584106bfcd7))
- **admin-search:** ajout de la pagination ([be997b8](https://github.com/solinumasso/soliguide/commit/be997b835d8e1ce8b01885a3a8661727a1ec32db))
- **admin-search:** ajout de la pagination ([2c15819](https://github.com/solinumasso/soliguide/commit/2c158198e89628ad6fe9db8a8ba4b5f1bb0defaf))
- **admin-search:** ajout des colonnes ([ff5701b](https://github.com/solinumasso/soliguide/commit/ff5701bad14186d2679939c1b2aef7f2af336efe))
- **search-admin:** création de la page de recherche ([be66fa0](https://github.com/solinumasso/soliguide/commit/be66fa084b29e95b17e5388999c2980853aaa6dd))
- **search-admin:** création de la page de recherche ([b925ac0](https://github.com/solinumasso/soliguide/commit/b925ac0314f8877c771ccc4e9b3397bb08b2beb9))
- ajoute le 06 dans le texte décrivant les territoires de Soliguide ([4262cd8](https://github.com/solinumasso/soliguide/commit/4262cd8cd8816bb95d4eaece588fb1e95f180e79))

### Reverts

- Revert "Print function" ([9d10e4a](https://github.com/solinumasso/soliguide/commit/9d10e4aa83a279a0c9126a286124d32854f4b6d7))
- Revert "print css" ([491bc1a](https://github.com/solinumasso/soliguide/commit/491bc1a8a9437a58efbd3db8de2013e6bddc7a7e))
- Revert "Ajout languages -->Search cote api" ([520f324](https://github.com/solinumasso/soliguide/commit/520f324554e000a60974e6345ed5b2735eea143b))
- Revert "Commentaires" ([561b2dc](https://github.com/solinumasso/soliguide/commit/561b2dcac37f6c05ae63cfdf039748a9e2ad2c76))
- Revert "[home] Affichage toutes categories" ([ae95778](https://github.com/solinumasso/soliguide/commit/ae95778c79cbe80201399e82d115f948a03c2e2a))
- Revert "Ajout fiches pratiques" ([4e05b7d](https://github.com/solinumasso/soliguide/commit/4e05b7df559fb04d8e9911befd3a30ae888407f0))
- Revert "Redesign-login" ([b2a9801](https://github.com/solinumasso/soliguide/commit/b2a980137e8e4a0adadbaa490d5a48659d72df87))
- Revert "(liste-resultat)Affichage filtre par défaut" ([f342a05](https://github.com/solinumasso/soliguide/commit/f342a0524cb78a4f473216ce67b3b697125cd6cc))
- Revert "fix : responsive" ([8e7545e](https://github.com/solinumasso/soliguide/commit/8e7545e2d890c1b1a28da007a69b32cd7ed506ec))
- Revert "Fix small screen" ([f74c581](https://github.com/solinumasso/soliguide/commit/f74c5816ef9d949b14a9ac311081131923ea1e4d))
- Revert "fix orthographe." ([a8a5f08](https://github.com/solinumasso/soliguide/commit/a8a5f08b367e3e41849c7eb60c679bcd0cad3419))
- Revert "fix(general): Coquille" ([8c2aed1](https://github.com/solinumasso/soliguide/commit/8c2aed12d99ff9b2ae8a8202a503111bd0f19e6e))
- Revert "feat: ajoute le 06 dans le texte décrivant les territoires de Soliguide" ([fdd10de](https://github.com/solinumasso/soliguide/commit/fdd10de80ccab47610f7e2361ee3327e61279d04))
- Revert "fix(language): corrige la faute d'orthographe d'espagnol" ([2d29d5b](https://github.com/solinumasso/soliguide/commit/2d29d5b21951ae3be268197d5d96790955a8f14b))
- Revert "fix(front-api-token): fix le problème de typage de l'id envoyé à l'api pour générer le token" ([199352b](https://github.com/solinumasso/soliguide/commit/199352be4671341f4b881a91010e82657413429b))
- Revert "Front dropdown" ([27e87ce](https://github.com/solinumasso/soliguide/commit/27e87ce30fb3125d7dca55217cebd6478ff072f0))
- Revert "Filtre langue" ([9c9c153](https://github.com/solinumasso/soliguide/commit/9c9c153bb014c8b61218b1930e36b11676885492))
- Revert "Rearrange filters" ([ab6059a](https://github.com/solinumasso/soliguide/commit/ab6059a86bad493a849d05cc18b9464af450e00b))
- Revert "Alphabetical order" ([eb4f754](https://github.com/solinumasso/soliguide/commit/eb4f754665f7f9c878a53b2c2132a6762f66a4cb))
- Revert "commantaires" ([57a4e06](https://github.com/solinumasso/soliguide/commit/57a4e0637607875f70f125b5d33198102e9448d9))
- Revert "Cleanup" ([a80256c](https://github.com/solinumasso/soliguide/commit/a80256c83e6d3f4539a889929d66a625aa1f7aca))
- Revert "gestion 403" ([67e681c](https://github.com/solinumasso/soliguide/commit/67e681c5ee7c16d411c6503e0997e7a89ccf7ea4))
- Revert "Ajout role" ([7a70add](https://github.com/solinumasso/soliguide/commit/7a70add49335f3e8b6e6bd813584ee544f34eafe))
- Revert "role-front" ([3fa1696](https://github.com/solinumasso/soliguide/commit/3fa1696117e2912356b3f6c9cf6437e4ed50a215))
- Revert "Front-admin-only" ([5f0d225](https://github.com/solinumasso/soliguide/commit/5f0d225cae43a69e89d276ae064efe435efb5921))
- Revert "message" ([3402b39](https://github.com/solinumasso/soliguide/commit/3402b39c4583894b7e955f44549f6efd0445b401))
- Revert "remove log" ([c34592c](https://github.com/solinumasso/soliguide/commit/c34592c93fd49532f950d76ef9392b177a0344ce))
- Revert "add admin" ([eb9d598](https://github.com/solinumasso/soliguide/commit/eb9d598f8a4f468f318f8ec37c6c4d8edde8ba55))
- Revert "retours yass" ([25cfcd6](https://github.com/solinumasso/soliguide/commit/25cfcd634d638e474c58bc755e00455f3d5cff64))
- Revert "retours pierre" ([99975ba](https://github.com/solinumasso/soliguide/commit/99975bac7994ce76ef7696ba025e7b22dca221c2))
- Revert "retours pierre" ([8ffe567](https://github.com/solinumasso/soliguide/commit/8ffe5677e96a3614c604997b20905087181ec519))
- Revert "Retours yassine" ([a6420d0](https://github.com/solinumasso/soliguide/commit/a6420d04ecfaaf985e49f38ab71679b7c174e119))
- Revert "feat(search-admin): création de la page de recherche chore(online): suppression de la partie online services obsolètes" ([f546eeb](https://github.com/solinumasso/soliguide/commit/f546eebd393902e5d2cc8301c60e59714972eee8))
- Revert "feat(admin-search): ajout de la pagination feat(admin-search): ajout des filtres actuellement cochés refacto(export): Refacto de l'export côté API" ([56694d4](https://github.com/solinumasso/soliguide/commit/56694d4fe012cd157407efc30186de307067541b))
- Revert "feat(admin-search): ajout des colonnes" ([78f1d93](https://github.com/solinumasso/soliguide/commit/78f1d93afc4ef423eb23ee0f596257d6d7b5d45a))
- Revert "feat(admin-search): ajout de la limite de résultat par page feat(admin-search): amélioration des filtres statut et fermeture" ([3576069](https://github.com/solinumasso/soliguide/commit/3576069f1f36ec317ef0b3928faae5a957ea552a))
- Revert "fix(admin-search): ajout des coordonnées au DTO" ([91c006f](https://github.com/solinumasso/soliguide/commit/91c006f99d5c40e43a6f5d103cb5a95380d86835))
- Revert "fix(logs): suppression des logs inutiles fix(general): corrections suite à la review" ([1684b67](https://github.com/solinumasso/soliguide/commit/1684b67b328c76abd63d5906ef7e71670c274ca6))
- Revert "fix(css): correction des retours" ([81ac9b5](https://github.com/solinumasso/soliguide/commit/81ac9b5249d44b6188cbf7e93bf37324358c4b70))
- Revert "fix(admin-search): correction de l'affichage des filtres" ([7c236c8](https://github.com/solinumasso/soliguide/commit/7c236c81199c369cff60ba812dff2a47ce49925e))
- Revert "fix: remove data export" ([9d35cb3](https://github.com/solinumasso/soliguide/commit/9d35cb320df1f72b289ac34121be81d89aac4302))
- Revert "fix(admin-search): correction des reset de filtres fix(funky): ajout d'un loader beaucoup plus sympa :)" ([2156e6c](https://github.com/solinumasso/soliguide/commit/2156e6caa0ccff1a9fdc973071a22db9aebab307))

## [1.6.2](https://github.com/solinumasso/soliguide/compare/v1.6.1...v1.6.2) (2021-03-30)

**Note:** Version bump only for package soliguide

## [1.6.1](https://github.com/solinumasso/soliguide/compare/v1.6.0...v1.6.1) (2021-03-30)

### Bug Fixes

- **admin-place:** corrige le code d'erreur des suppression de fiche qui est undefined ([27f9353](https://github.com/solinumasso/soliguide/commit/27f9353d337953d0a26cbb6e259b573e398edcc5))
- **admin-place:** corrige le code d'erreur des suppression de fiche qui est undefined ([63c8955](https://github.com/solinumasso/soliguide/commit/63c8955630508e304b6a777aa4b0f3f242f32cf2))
- **sentry:** ajout du numéro de version ([d78f76b](https://github.com/solinumasso/soliguide/commit/d78f76ba2acc29adaaf82d15303d0b54ab96ad57))
- **sentry:** configuration de la version pour l'API ([49d2d10](https://github.com/solinumasso/soliguide/commit/49d2d10d307ff5f724aa77d34a71d1cce544a1b4))
- **sentry:** mise à jour de la config senntry ([57f887b](https://github.com/solinumasso/soliguide/commit/57f887b539c8395a5958b135fc31b1fcf9001f6a))

# [1.6.0](https://github.com/solinumasso/soliguide/compare/v1.5.1...v1.6.0) (2021-03-27)

### Bug Fixes

- **form-service:** corrige le bouton showModalities qui s'affichait toujours décoché ([288e697](https://github.com/solinumasso/soliguide/commit/288e697ba74d2ff50cf98c33dfc6ea4e2049b86e))
- ajoute les publics et modalities au limitdata des services ([342c529](https://github.com/solinumasso/soliguide/commit/342c5294eb580be6a05f01a861b7fb1cd7cb89a7))
- **ci:** bug du build ([1e24ad8](https://github.com/solinumasso/soliguide/commit/1e24ad89d652983dfa44fb033fa726b2d5c404fb))
- **services:** ajoute un constructeur pour les horaires, publics et modalities des services quand il n'y a pas d'initialiseurs dans le service ([9d78bf2](https://github.com/solinumasso/soliguide/commit/9d78bf28c1687bdedab31ec4ce03d46675a1cf28))
- merge branch ([b9b4407](https://github.com/solinumasso/soliguide/commit/b9b4407419d42557fbb3f49ac2f943d54941bd2c))
- **admin-place:** ajout des fiches ([5f72bf3](https://github.com/solinumasso/soliguide/commit/5f72bf3c37e7328fefe125a861a6a46a9659da45))
- **ci:** correction de bugs dans le build du code ([0df73f1](https://github.com/solinumasso/soliguide/commit/0df73f1067e3a2f3a3f1c75c4b8b03dfc6b43a4b))
- **ci:** suppression du yarn.lock pour test ([a17ce64](https://github.com/solinumasso/soliguide/commit/a17ce64b1079d881c6a3325dc6d49f72881bf89f))
- **core:** correction de soucis pour le build en strict mode ([27af4b7](https://github.com/solinumasso/soliguide/commit/27af4b7c92ceb9cbb49fad90dce52842ef02e302))
- **deps:** update all dependencies ([eccdbc5](https://github.com/solinumasso/soliguide/commit/eccdbc5fecbaa9d40239eeb354dceb77a0f387d8))
- **general:** delete dump ([5f0f0cf](https://github.com/solinumasso/soliguide/commit/5f0f0cf51f94cd33646ff8857767cc180dbf78a4))
- **gitignore:** update pour supprimer le dump ([4f7546f](https://github.com/solinumasso/soliguide/commit/4f7546fd367a05017054de3db973a9b30f060c6c))
- **place-service:** enlève les badges de saturations pour les services s'ils sont peu ou pas saturé ([ecd7af0](https://github.com/solinumasso/soliguide/commit/ecd7af00a14ab27dc81aeb07ac4f2e7433415a94))
- ajout du téléphone à la config expressValidator ([6c14654](https://github.com/solinumasso/soliguide/commit/6c14654218c47cf2d1643b7eaa741e0df56bd20d))
- change le title de Solinum V2 en un titre plus cohérent ([95bf255](https://github.com/solinumasso/soliguide/commit/95bf2558239e1a812e42de5a955c66081fd77d4c))
- fichier logs ignoré par le gitignore ([f4ebb7b](https://github.com/solinumasso/soliguide/commit/f4ebb7be33711b33c95800d43e83291b4894b753))
- fichier logs ignoré par le gitignore ([4348f21](https://github.com/solinumasso/soliguide/commit/4348f213e83a7c75d1325b937eed1a9c52e6936d))
- fontawesome lors du build ([d698161](https://github.com/solinumasso/soliguide/commit/d698161e4ace71b7d0c926efa34e1bf353f5b9d2))
- n'affiche plus une notif pour les structures saturées ([3006513](https://github.com/solinumasso/soliguide/commit/3006513bdf75ce3dbfada6188aa912ec8710e498))
- packages.json ([3018e90](https://github.com/solinumasso/soliguide/commit/3018e90e6fe157ef3afb37ae3cc25dfed338ea09))
- remove the .env with GH_token ([232367c](https://github.com/solinumasso/soliguide/commit/232367c867047dd3a2699af32242ea2fb477b68b))
- **log-search:** ajoute la recherche après l'ajout de la localisation en base pour éviter le double ajout ([365fb47](https://github.com/solinumasso/soliguide/commit/365fb476a2cf803afb37b6958cba8ec8c074c50a))
- **log-search:** fix le problème de la localisation dans les logs de recherche ([bf08d2e](https://github.com/solinumasso/soliguide/commit/bf08d2e5cdba6c6a2bd0adf78aa47c1ce98ecd06))
- **log-search:** fix le problème de la localisation dans les logs de recherche ([1c072b0](https://github.com/solinumasso/soliguide/commit/1c072b08840c19ceb47830ef94e8f65b97cbcefe))
- **search-filters:** corrige le filtre sur les animaux de compagnie pas pris en compte ([26d58e3](https://github.com/solinumasso/soliguide/commit/26d58e369d7ca5036c095840a90f524bfe699bec))
- création / édition d'orga ([5246bb3](https://github.com/solinumasso/soliguide/commit/5246bb3966ef285a8904e0fd68b24cceeba0148a))
- remet en place l'ajout des docs sous forme d'id et pas de doc complet ([04ae52b](https://github.com/solinumasso/soliguide/commit/04ae52b071eb1caebcf7936bd68b6a4b2e4c4bb8))
- remove winston ([6b7dd57](https://github.com/solinumasso/soliguide/commit/6b7dd57bb2f99b680ab22ca0420cedf25a546863))
- suppression des passwords des requêtes ([443385d](https://github.com/solinumasso/soliguide/commit/443385d2ccdb55f3d3529e57c8d21205dd75217a))
- typescript version ([12df7cb](https://github.com/solinumasso/soliguide/commit/12df7cb221f4c01ee19f9f24846ee1a8863275cd))
- update packages + lint ([3962b7a](https://github.com/solinumasso/soliguide/commit/3962b7ae20381b1f5858bfd41b97a5cc98b2907d))

### Features

- **fronntend:** ajout du strict mode ([cef3ffc](https://github.com/solinumasso/soliguide/commit/cef3ffcf523919e1f9fa16fc5a5e8a75d7f140b3))
- **geoloc-search:** Ajoute l'adresse associé à la géolocalisation dans la recherche ([7a396dc](https://github.com/solinumasso/soliguide/commit/7a396dcd2a127738b7f4e3dc9c2944cf90d49029))
- **log-search:** création du fichier model des recherches ([a2edeaf](https://github.com/solinumasso/soliguide/commit/a2edeaf7e2d81aeb0023d4504ab0660b8dc2d08d))
- **log-search:** enregistre la recherche à chaque requête ([65218c4](https://github.com/solinumasso/soliguide/commit/65218c4ba81a45f7b420cbdb7ab73b9fce192746))
- **log-search:** enregistre la recherche à chaque requête ([c1d286b](https://github.com/solinumasso/soliguide/commit/c1d286b1276eccbd6fbd031bd2691ea077fe2ed7))
- **log-search:** type l'enregistrement des recherches en base ([4308cda](https://github.com/solinumasso/soliguide/commit/4308cdabaee23c12a5c3a90fdd433b0fe2b1bb28))
- **log-search:** type l'enregistrement des recherches en base ([a7c122b](https://github.com/solinumasso/soliguide/commit/a7c122b46fd88c22a20cc68375dff38080d622c9))
- ajout d'infos de contexte à Sentry ([c992fc5](https://github.com/solinumasso/soliguide/commit/c992fc5401600cc0560beadbeed11c02ac710ea5))
- ajout des scripts airtable ([ee7fe60](https://github.com/solinumasso/soliguide/commit/ee7fe6088586bc21c9f582538a1484c99d4929b8))

### Performance Improvements

- suppression du dump du repo ([c4052eb](https://github.com/solinumasso/soliguide/commit/c4052ebee72737182ca05876f8cf4c378650f3c6))

## [1.5.1](https://github.com/solinumasso/soliguide/compare/v1.5.0...v1.5.1) (2021-03-26)

**Note:** Version bump only for package soliguide

# [1.5.0](https://github.com/solinumasso/soliguide/compare/v1.4.0...v1.5.0) (2021-03-26)

### Features

- **test:** ajoute un fichier test pour les modalities ([6309589](https://github.com/solinumasso/soliguide/commit/63095890238158f19a43761c75228492bf7c407f))

# [1.4.0](https://github.com/solinumasso/soliguide/compare/v1.3.0...v1.4.0) (2021-03-26)

### Features

- **test:** ajoute un fichier test pour les publics ([e4fd12d](https://github.com/solinumasso/soliguide/commit/e4fd12dc73b0473a2ae3dedbd4ce42429f738ede))

# 1.3.0 (2021-03-26)

### Bug Fixes

- **deps:** update all dependencies ([ca44b53](https://github.com/solinumasso/soliguide/commit/ca44b53118ce41387821bb9dd80786bd96dc6855))
- **upload-doc:** corrige la suppression des docs au niveau des modalities ([bb0633f](https://github.com/solinumasso/soliguide/commit/bb0633fc708305fdc7651ebe4b077e23312d8e78))
- [#97](https://github.com/solinumasso/soliguide/issues/97) modeles de données départements & régions ([1f765e8](https://github.com/solinumasso/soliguide/commit/1f765e8bd625ea8d400096818e39ba9e6d54fb74))
- active la mise à jour de la date de mise à jour des fiches ([e278ca0](https://github.com/solinumasso/soliguide/commit/e278ca06e53c867871c751bb750bed0d905b53b8))
- add / to invite link ([c2c76c2](https://github.com/solinumasso/soliguide/commit/c2c76c2beaa9c3792e8919e7d59452ecfd011a46))
- affichage des publics ([9f84439](https://github.com/solinumasso/soliguide/commit/9f844398382ea0bd23ee4b57443e671c7deb7687))
- Affiche un message de succès quand une invitation est renvoyé ([6097424](https://github.com/solinumasso/soliguide/commit/60974245227b3cc9712f61a1553ed40e97d6df87))
- ajout de description dans les horaires ([73b9c30](https://github.com/solinumasso/soliguide/commit/73b9c300d364549566c5e91e3334a77d18f943be))
- Ajoute les scripts de lancement de tarteaucitron sur les fichiers index.html de la prod et de la preprod ([f7eb124](https://github.com/solinumasso/soliguide/commit/f7eb124ccfe72592ad67f94122907196d779cde3))
- ajoute un bandeau pour spécifier que le site bug ([cd65010](https://github.com/solinumasso/soliguide/commit/cd6501043f4bcb2c93ae6e012d784d719746183a))
- angular.json ([a8ff8eb](https://github.com/solinumasso/soliguide/commit/a8ff8ebe2b060a83546d2f6c932e7f4e21248b4a))
- auth bug ([89bc86e](https://github.com/solinumasso/soliguide/commit/89bc86ed05482409cf760951cadb7dabe9f8470e))
- bouton télécharger le fichier d'orientation ([e21c983](https://github.com/solinumasso/soliguide/commit/e21c983d1613640462ba1ff13e01c67e297fa9c8))
- bug d'affichage ([c1cb722](https://github.com/solinumasso/soliguide/commit/c1cb722d0be9bc687ec89b64f0bf26aea74a75f9))
- bug manage-place ([ddd1bbd](https://github.com/solinumasso/soliguide/commit/ddd1bbdf2e227ba20a577d024e26e1222a82872c))
- categorie range services ([aa54a31](https://github.com/solinumasso/soliguide/commit/aa54a31545ca049af3906ead7c5bb5a3b7cd169b))
- Change la navbar quand l'utilisateur se déconnecte ([dbe6801](https://github.com/solinumasso/soliguide/commit/dbe68019f83da8bda9eb9724e0e12300e013bcf7))
- change le timestamp des places à true ([bf1d510](https://github.com/solinumasso/soliguide/commit/bf1d5106b05624d902a8f177a6ae3ac92b6b153e))
- change les traductions des langues dans la navbar ([9508c53](https://github.com/solinumasso/soliguide/commit/9508c53859ed8d8c59d7bdf5c3ddff00415398d3))
- changement des boutons pour télécharger une fiche d'orientation ([6b1c281](https://github.com/solinumasso/soliguide/commit/6b1c2813ce3fffd0ee06aa744b85e0e37ebe2388))
- changement du nom de public car non utilisable ([1a70b0e](https://github.com/solinumasso/soliguide/commit/1a70b0e40764226db9fd3651a8183fe15f3c863c))
- chemins défectueux ([b879b13](https://github.com/solinumasso/soliguide/commit/b879b13cd567eb4676911c08f9d89cf1cbc55214))
- commentaires ([c4c51cb](https://github.com/solinumasso/soliguide/commit/c4c51cbfa7977271be8aeb6f8208097205137aa8))
- contact mail ([fdea975](https://github.com/solinumasso/soliguide/commit/fdea975ba4226c18fac917e8e7023a3637bdf5ad))
- correction de bugs quand on appuie sur Entrée ([adac448](https://github.com/solinumasso/soliguide/commit/adac448191fb6c7e63602558d1c338fae3accc37))
- correction de l'interface condition ([a0c2669](https://github.com/solinumasso/soliguide/commit/a0c2669333c0c57a084c852a20468fa977565c78))
- correction du terme "public" ([6f160cd](https://github.com/solinumasso/soliguide/commit/6f160cd6e5880590b5ec3ecdbc0ab06e8803b378))
- corrections pour la mise en prod ([feae6e6](https://github.com/solinumasso/soliguide/commit/feae6e6cb11581bcc8260a2d838a414bea96a221))
- corrige l'import de TextInput dans @angular/core qui empêchait la compilation ([6a53196](https://github.com/solinumasso/soliguide/commit/6a5319687397b5aaa052b2a25496365ae7440bd6))
- corrige l'import de TextInput dans @angular/core qui empêchait la compilation ([4ab8346](https://github.com/solinumasso/soliguide/commit/4ab83464f4746d5b7bbcbea6e139247c82c16c75))
- corrige l'upload de photos qui était plus bon avec le refacto du findPlace ([798c32b](https://github.com/solinumasso/soliguide/commit/798c32b948cfda727319d2ccf8f1aea3cfa7edee))
- Corrige la recherche par nom dans le manage-place ([bcfbf47](https://github.com/solinumasso/soliguide/commit/bcfbf477e9f967b03079a3d7905e6eb4e436acdd))
- corrige le css du dropdown du choix des langues ([6e35d6d](https://github.com/solinumasso/soliguide/commit/6e35d6d3a700330ab73308aace358b8d216567ae))
- cron task ([a803b67](https://github.com/solinumasso/soliguide/commit/a803b678b41c0e0c160ef5af11a5418f2fb465e4))
- delete fsevents ([33fb552](https://github.com/solinumasso/soliguide/commit/33fb552bd411f21c2caddaff02fd5398a9b0d061))
- device check date ([b2c0325](https://github.com/solinumasso/soliguide/commit/b2c03254c3254c231f192d665524921bb54ac8fb))
- droits mal gérés sur les éditions de ficheé ([2405843](https://github.com/solinumasso/soliguide/commit/24058437306739d9b59dad1ad67fc8a5623b1543))
- environnement file ([dde3292](https://github.com/solinumasso/soliguide/commit/dde3292860afefae8f76b17d282453130e8462bc))
- environnement file ([f456eef](https://github.com/solinumasso/soliguide/commit/f456eef2713af7a00a0c81cb0c833518fadb85d3))
- erreur api ([1aa23a4](https://github.com/solinumasso/soliguide/commit/1aa23a49938ba2cf8482df5337a89f929caa189d))
- Erreur lors de la premiere recherche ([e28b8d1](https://github.com/solinumasso/soliguide/commit/e28b8d156caaf8819750f837d515f9249998abc8))
- erreurs de chemin ([226414e](https://github.com/solinumasso/soliguide/commit/226414e0407f233fa34481a132e111811674f1cc))
- erreurs de design ([628635b](https://github.com/solinumasso/soliguide/commit/628635b4f0879aa9f7235e7754498e0a98f1d3e5))
- erreurs user.routes.js + changement MEIS +update home ([65ce1bc](https://github.com/solinumasso/soliguide/commit/65ce1bc5ea7cc03696f82dd8d56ef5049a86dfd0))
- first commit ([932195a](https://github.com/solinumasso/soliguide/commit/932195a415f1bef7762e9129c05b9a662aa8befc))
- fix invite pour auto-invite Airtable ([afc999a](https://github.com/solinumasso/soliguide/commit/afc999a1f8ccfe3711835b7c1c95461e87d1001a))
- home ([6f563a8](https://github.com/solinumasso/soliguide/commit/6f563a858d3dfac23ddfadc124d52e85dcc7a480))
- homepage categories ([ad4b6f3](https://github.com/solinumasso/soliguide/commit/ad4b6f34df2c98e13a70abef73d744ff5b485cfc))
- import empechant la compilation ([e385e23](https://github.com/solinumasso/soliguide/commit/e385e232783c59c2a133062a837853ea51d3db75))
- index preprod ([17dd664](https://github.com/solinumasso/soliguide/commit/17dd66446785adbcb2b914f075ebafe13189340c))
- invite AT ([82849e5](https://github.com/solinumasso/soliguide/commit/82849e53f1cc182b56f61008b7ff7e2d3bfec2d5))
- le bouton de deconnexion affiche un curseur clickable ([4f3ce85](https://github.com/solinumasso/soliguide/commit/4f3ce857ac3b4282ddde25f26f4e921a0210f01d))
- manage place (links/publics/conditons) ([b004790](https://github.com/solinumasso/soliguide/commit/b00479022f0492560b5ec43f2c7a3db437c4bf45))
- manque un petit slash ([68ebb1b](https://github.com/solinumasso/soliguide/commit/68ebb1b59afb86f488bcc5302be4498633fd5cdb))
- menu errors ([98bebf1](https://github.com/solinumasso/soliguide/commit/98bebf1b48ccb3610c9e6051025ce65579099aba))
- migrationn des ages ([59777a4](https://github.com/solinumasso/soliguide/commit/59777a4d68a388442eab69d37fd8cc94e15902fd))
- mise à jour des packages ([59b2f7c](https://github.com/solinumasso/soliguide/commit/59b2f7c00d924b680aaee1d9a15added5aca3ba3))
- mise en page des langues + ajout de la petite croix ([02ef82c](https://github.com/solinumasso/soliguide/commit/02ef82c5607397932c990398479ded2f546745e4))
- modalités bug ([a12e5b4](https://github.com/solinumasso/soliguide/commit/a12e5b46b60423995eb9f1e5510fbf59596647b8))
- modalities migration ([99560c7](https://github.com/solinumasso/soliguide/commit/99560c719aa9cf623aa9541bc3b7e4c0764082db))
- module manquant ([d242417](https://github.com/solinumasso/soliguide/commit/d242417e1dddcdba114105915775c20c465f84bc))
- module manquant ([9069840](https://github.com/solinumasso/soliguide/commit/906984015562df970862a763c80716ef623fdc6f))
- module manquant ([974643c](https://github.com/solinumasso/soliguide/commit/974643c86ee0b1b9a97cbe5da57c0017566a7f78))
- modules manquants ([b345b75](https://github.com/solinumasso/soliguide/commit/b345b752ecf9cc34e465bb763e7d9c0b2ae683cd))
- nom de organisation interface ([704fc94](https://github.com/solinumasso/soliguide/commit/704fc949de0f4041b1f98dfbd0b34f911b747e8a))
- ordre des jours dans les horaires ([ce04d08](https://github.com/solinumasso/soliguide/commit/ce04d08e9d3904ae89726d8c00b2ece8fcf6033e))
- package start api ([3792346](https://github.com/solinumasso/soliguide/commit/3792346dfb3b0d2917f84399bf0c249264865d29))
- packages update ([1342406](https://github.com/solinumasso/soliguide/commit/1342406a767b5ba768f79e4f2e72d5d61144f4be))
- preprod build ([6d59068](https://github.com/solinumasso/soliguide/commit/6d5906891d55f9210fe52a46d7f9c1501e10585b))
- prod problems ([65d1f07](https://github.com/solinumasso/soliguide/commit/65d1f079c1f29537abae7bbb0d8c9f4d245076bc))
- readme infos pour les commit ([37286f7](https://github.com/solinumasso/soliguide/commit/37286f78d4e8f03cca48de4dfac3cb286344377b))
- recherche ([aba989f](https://github.com/solinumasso/soliguide/commit/aba989f1385c2b2eee4cfe51129960318322f5c7))
- search ([bfe7dfe](https://github.com/solinumasso/soliguide/commit/bfe7dfe654e16a8b992fe2e1e69f85050d105ed7))
- sentry errors ([6749ef0](https://github.com/solinumasso/soliguide/commit/6749ef05b94c493a07491f8fa49c099554baf9d3))
- **cookies-ga:** retire google analytics du gestionnaire de cookies et l'execute automatiquement ([84daff2](https://github.com/solinumasso/soliguide/commit/84daff2e11e87448de3d802a9af6d6bcce1bcd8a))
- **partners-limitation:** Diminue le délais pour la vérification de la catégorie ([6ec82db](https://github.com/solinumasso/soliguide/commit/6ec82db5c5c2ace5697eb06a70a80da674154b73))
- **partners-limitation:** Fix la limitation des partenaires et de la recherche par catégorie ([ea46284](https://github.com/solinumasso/soliguide/commit/ea462840964e3b94641b4cbfb6662876faafd343))
- **search:** fix la recherche pour les partenaires pour limiter leur action à certaines catégorie ([f14b69e](https://github.com/solinumasso/soliguide/commit/f14b69ed579f7c2acaefa65b73d6cca1a8b8dff2))
- fix la condition d'affichage du bouton page suivante ([111719a](https://github.com/solinumasso/soliguide/commit/111719ad7ca55a8f8cd8af7e2ac62cefb7efa122))
- fix le canEdit ([fdcb31d](https://github.com/solinumasso/soliguide/commit/fdcb31d06002e440b5db84b87106c8f5c80dacac))
- fix le z-index de la navbar pour que ses éléments soient affichés en premier plan ([ef7e5c4](https://github.com/solinumasso/soliguide/commit/ef7e5c4eaab7ebb6d0e9e1a05c090890e1c971db))
- fixe la limit de résultats renvoyés par la recherche à 20 par défaut ([13e876b](https://github.com/solinumasso/soliguide/commit/13e876bbe273e04bc328b6ed4a4d53343a0e24cd))
- initialise la limite de la recherche dans le front à 20 par défaut ([e3383e7](https://github.com/solinumasso/soliguide/commit/e3383e70a3d4488c7ab85b56b7c0c983dad20d15))
- le bouton page suivante ne s'affiche plus quand le nombre de résultat est égale à la limite de resultat ([14fb41b](https://github.com/solinumasso/soliguide/commit/14fb41be6db5982e11b0a30d2234160002559a2a))
- lint ([4cdab41](https://github.com/solinumasso/soliguide/commit/4cdab418b31bd8313194b6164fd15b2a4ffc5156))
- migration des locations ([003d579](https://github.com/solinumasso/soliguide/commit/003d57913bd86cdcdc6adb1207b0f414bfbf8721))
- preprod ([5979acf](https://github.com/solinumasso/soliguide/commit/5979acf4bbd0409029b7d51abf1e8c6cb25359ce))
- problemes de css sur les fiches ([0ca0415](https://github.com/solinumasso/soliguide/commit/0ca0415e4604d4e9c98209e8d6a281ac1add1305))
- remplace un peu saturé par normal pour les services ([1eba053](https://github.com/solinumasso/soliguide/commit/1eba053e32779c9cd419a808525d7e0e228b3d61))
- sentry logs trop complexes + corrections d'affichage ([176a8a9](https://github.com/solinumasso/soliguide/commit/176a8a9a266b64398b8f398de22ea2934a806aa3))
- **navbar:** les drapeaux de la navbar change en fonction de la traduction choisie ([38c099a](https://github.com/solinumasso/soliguide/commit/38c099a17182db2f89374728df4d454e10c8e6c3))
- rends cliquable le lien de renvoie d'invitation sur la liste des utilisateurs invités ([64bb3c6](https://github.com/solinumasso/soliguide/commit/64bb3c6632c9d8e31591ec890d156a69b5e9d41f))
- **crisp:** Rends crisp autorisé de base avec tarte au citron ([054b318](https://github.com/solinumasso/soliguide/commit/054b31879f9db6e01e06b02b7c75c9af8aa85316))
- **invite-member:** empêche les orga d'inviter des membres dont l'email existe déjà ([aab9ac2](https://github.com/solinumasso/soliguide/commit/aab9ac200b72aa8a695e771e2168949c71e64ec5))
- menu ([f1a6215](https://github.com/solinumasso/soliguide/commit/f1a621525f7fc04dd9bf7fc41e3d0daf54f84b50))
- prod issue ([ab3c0dd](https://github.com/solinumasso/soliguide/commit/ab3c0ddc8192cd0e6c1cf225d1f42704bdb5f649))
- recherche failed ([d91390f](https://github.com/solinumasso/soliguide/commit/d91390fd410446b5c026c4b185ee1bd9f85ff85a))
- search in location ([f816eb2](https://github.com/solinumasso/soliguide/commit/f816eb21bcf6b77f80a72403043100d50aabcb2c))
- services names ([63f5256](https://github.com/solinumasso/soliguide/commit/63f5256bc41ee520236e42d1b8ff21f401fd322d))
- timestamps ([6e93b9d](https://github.com/solinumasso/soliguide/commit/6e93b9deff771f3b485f293848333acda5d74ab0))
- translate des horaires ([932f319](https://github.com/solinumasso/soliguide/commit/932f319d489ef7a02924a75ae9b45579e5c1d16c))
- tslint ([891a9d4](https://github.com/solinumasso/soliguide/commit/891a9d41a6e2d6c89a007ad1c58ce70655a94064))
- tslint warning ([eb2439d](https://github.com/solinumasso/soliguide/commit/eb2439db1ecf1d1e78c642169c46ac00369e705e))
- variables nulles empechant la compilation ([10e3d36](https://github.com/solinumasso/soliguide/commit/10e3d3699f5b093d473a42645eaca1f9dafe14c3))
- **deps:** update dependency npm-check-updates to v7 ([a8f0ddd](https://github.com/solinumasso/soliguide/commit/a8f0ddd5d9ea0e061c2f8d9c5167497ec504d9e6))
- **deps:** update dependency winston to v3.3.0 ([193d5e4](https://github.com/solinumasso/soliguide/commit/193d5e477fe229b579acef4c03a2c0814b943a48))
- **general:** correction d'erreurs empêchant le build ([998ddac](https://github.com/solinumasso/soliguide/commit/998ddac0725b443cb5a56a7b4d035ed8ab9b4f06))
- **lint:** correction des soucis de lint sur le front ([0afa5fc](https://github.com/solinumasso/soliguide/commit/0afa5fccd3e65f4b8cc9d5cb7e3027bdf1f4ff2a))
- **place:** correction d'un doublon sur l'interface ([5ae6e33](https://github.com/solinumasso/soliguide/commit/5ae6e332e6947b68023ee9032e447d01db91fcb0))
- **users:** correction du formulaire d'update ([68495f1](https://github.com/solinumasso/soliguide/commit/68495f1d7a44721b13db240fba0ceb46132cda45))
- **users:** hide password ([5a3cb4a](https://github.com/solinumasso/soliguide/commit/5a3cb4af6954be9ace385ca5131c29240f95fe29))
- test ([a795138](https://github.com/solinumasso/soliguide/commit/a7951383c90756773fc30efddfc81f9211542f91))
- tslint et editeur config ([ca7a82a](https://github.com/solinumasso/soliguide/commit/ca7a82a725fdfe85dcaf69bf11fb17bb4f6b2193))
- update ([a2e3dbe](https://github.com/solinumasso/soliguide/commit/a2e3dbe70224c393e711a9ead2b56111788d384c))
- workspaces names ([de5418d](https://github.com/solinumasso/soliguide/commit/de5418d549e06e41dcd45f016cb2ff3471858d01))

### Features

- Ajoute le département 06 au formulaire de contact ([5419b7a](https://github.com/solinumasso/soliguide/commit/5419b7aadce5949513a73039c81130f3efc191b7))
- bascule complète de l'autocomplete côté API ([df00127](https://github.com/solinumasso/soliguide/commit/df001271dcce2c00ef84b3346581b24865c13da6))
- slug des description / titre ([b2eff72](https://github.com/solinumasso/soliguide/commit/b2eff72f99f35df5088e49b9078995a2a58ed24b))
- **admin:** ajout de l'autocomplete des adresses au form ([9f0f393](https://github.com/solinumasso/soliguide/commit/9f0f393399cce16df248e96e2cdd6cbd501f3702))
- **admin:** ajout de l'interface des horaires et des conditions ([d997a87](https://github.com/solinumasso/soliguide/commit/d997a870dcddfce01261773a7bfacbc26da4a0d3))
- **admin:** formulaire étape 1 intégré ([1f6626a](https://github.com/solinumasso/soliguide/commit/1f6626a9480859af40ff1ef1239d4a5082edf3e8))
- **database:** ajout d'un script pour récupérer le dernier dump en un clique ([39c829c](https://github.com/solinumasso/soliguide/commit/39c829c1ab6cdcb4654ca87318826c4f38e684c7))
- **navbar:** ajoute les traductions des langues utilisées dans les fichiers de traduction ([aee4e0d](https://github.com/solinumasso/soliguide/commit/aee4e0db9fd8e883c3250c7551564a01f1410db1))
- **navbar:** change la selection des langues en un dropdown ([73a5eca](https://github.com/solinumasso/soliguide/commit/73a5eca4d1d3cf4e6e84abe7f91f04185797dd22))
- **navbar:** fix le design du dropdown du menu que ça soit sur mobile et sur ordinateur ([0266a5d](https://github.com/solinumasso/soliguide/commit/0266a5dd7ff1ecab072e5b1b0d63f15c312cd1a6))
- **navbar:** modifie les images des langues pour enlever les contours transparents ([bccf7dd](https://github.com/solinumasso/soliguide/commit/bccf7dde74b0d9c6e43f9b648aa11bba98d84d8e))
- ajoute le dropdown 'mon compte' à la navbar collapsed sur mobile ([6956eac](https://github.com/solinumasso/soliguide/commit/6956eac8e24c457d80ba33d792e37086da49e52e))
- **admin:** récupération des données d'une fiche ([9e05d31](https://github.com/solinumasso/soliguide/commit/9e05d31643f7c70c05ec94a227eb0d153cf94530))
- **eslint:** ajout d'une config ESlint qui vérifie la présence des fichiers ([61d1bd7](https://github.com/solinumasso/soliguide/commit/61d1bd7c51ded7c9a4c3be1887a836170db2d1b7))
- **general:** bootstrap is on fire ([6d2fe9c](https://github.com/solinumasso/soliguide/commit/6d2fe9c3f71c00fbea7cb7b031041f34dd37f1e7))
- **horaires:** correction du H24 ([382ecda](https://github.com/solinumasso/soliguide/commit/382ecda675a085f5d92353b7430cb4941a8bbd8d))
- **horaires:** support du 24h24 ([5855ee0](https://github.com/solinumasso/soliguide/commit/5855ee0990111717f33094f4242c96866d8d64e7))
- **interfaces:** mise à jour des interfaces d'horaires ([ee355d1](https://github.com/solinumasso/soliguide/commit/ee355d15db0610c207dc1a096327d8c541c3769d))
- **login:** connexion à l'API réussi ([b9aee12](https://github.com/solinumasso/soliguide/commit/b9aee12ad6fa8a129d66d52a83bc3242970adff3))
- **login:** version 0 de la connexion ([18278ec](https://github.com/solinumasso/soliguide/commit/18278ec29bc0b93345c7f3cc41df8a32d2ee5125))
- **search-filters:** Ajout le component search-filter à la page de recherche ([9aa2375](https://github.com/solinumasso/soliguide/commit/9aa2375faf6bad99032ab8e8adc1401f946e4878))
- **search-filters:** Ajoute le front pour les genres aux filtres ([513e898](https://github.com/solinumasso/soliguide/commit/513e898d486162b50c12030f377b6ccb38e88757))
- **search-filters:** Ajoute le reste des publics aux filtres ([b744253](https://github.com/solinumasso/soliguide/commit/b744253cebfbf77c35ee02fced44440d2919d9a5))
- **search-filters:** Ajoute les filtres pour les animaux de compagnie et les pmr et fix la pagination à 1 de base dans le front ([a0f0dc2](https://github.com/solinumasso/soliguide/commit/a0f0dc232866ad8b0db07fa42327ae90c77d8a42))
- **search-filters:** Ajoute les query parameters dans la recherche au chargement de la page ([7ecc640](https://github.com/solinumasso/soliguide/commit/7ecc640412210ab2a131b75809dc779b6b65d28f))
- **search-filters:** Ajoute un bouton toggle pour les filtres dans le component de la recherche ([0afe47b](https://github.com/solinumasso/soliguide/commit/0afe47b3570ba1256f801ece5c123c0c47eea476))
- **search-filters:** Ajoute une classe css pour tronquer les items des dropdowns du public et ajoute un tooltip pour afficher le texte complet au dessus ([af4555d](https://github.com/solinumasso/soliguide/commit/af4555df3147f1db36e25f0829513d80ce0e9971))
- **search-filters:** Création d'un component pour les filtres dans la recherche ([4a4eb90](https://github.com/solinumasso/soliguide/commit/4a4eb90d72a79e41f9b141d8188315410fd7d321))
- **search-filters:** Envoie les filtres actifs au component chargés des filtres ([6b61ca0](https://github.com/solinumasso/soliguide/commit/6b61ca0ffe6c2c972cc015048082654a0cf577ed))
- **search-filters:** Fix la recherche pour les booléens des modalities ([ae08789](https://github.com/solinumasso/soliguide/commit/ae08789fe406465bd09ef3f1aeebe66e33d98c9b))
- **search-filters:** Implémente tous les filtres des publics et crée une zone distincte dans le front ([2c40961](https://github.com/solinumasso/soliguide/commit/2c409617de0538c1e137c7e8d03877f264bff72a))
- **search-filters:** Le filtre genre marche avec la recherche ([e3bd3b1](https://github.com/solinumasso/soliguide/commit/e3bd3b18e7a864b083c1e25ccb553583b7bd4237))
- **search-filters:** Mets la pagination de la recherche de base à 1 ([8bda187](https://github.com/solinumasso/soliguide/commit/8bda1870a3ebab1e42820260ec04f291c1505a23))
- **search-filters:** Remplace filters.family par filters.familialle pour être plus en cohérence avec la BDD et l'objet search ([5849f2a](https://github.com/solinumasso/soliguide/commit/5849f2a8d7c16632bf8181653c0231e9891a2086))
- **sitemap:** Change l'emplacement du fichier sitemap.xml vers le dossier dist ([b51f2af](https://github.com/solinumasso/soliguide/commit/b51f2afb98592a5fd0aa4a3df7081a3933666583))
- **sitemap:** Change l'emplacement du fichier sitemap.xml vers le dossier dist ([74875aa](https://github.com/solinumasso/soliguide/commit/74875aadc6c778de6b002d7ca8bd2a183affff62))
- **sitemap:** change le path du sitemap.xml pour qu'il soit écrit au niveau du front ([77078a1](https://github.com/solinumasso/soliguide/commit/77078a10d685f1af898fd793b1a585123ea80056))
- **sitemap:** change le path du sitemap.xml pour qu'il soit écrit au niveau du front ([70d3815](https://github.com/solinumasso/soliguide/commit/70d3815b299d43b8a59ab1a4b19a5eab8c13da0b))
- **sitemap:** Implémentation d'un cronjob pour générer un sitemap à jour tous les jours à minuit ([49c6f25](https://github.com/solinumasso/soliguide/commit/49c6f25873eb7db0af67b3674e1c1176d964ce8b))
- **sitemap:** Implémentation d'un cronjob pour générer un sitemap à jour tous les jours à minuit ([a4cb8a4](https://github.com/solinumasso/soliguide/commit/a4cb8a44246b1c0136501ce4102600b5ebd5ae21))
- **sitemap:** Implémentation de la création du fichier sitemap.xml côté API ([5326618](https://github.com/solinumasso/soliguide/commit/53266186df5e3be8b7c14a05fb9df73b48e196e6))
- **sitemap:** Implémentation de la création du fichier sitemap.xml côté API ([5313c0a](https://github.com/solinumasso/soliguide/commit/5313c0a806539994c8def9114df566e34f089439))
- **sitemap:** implémentes les fonctionnalités pour générer un fichier sitemap.xml ([32a2aeb](https://github.com/solinumasso/soliguide/commit/32a2aebc1849fe143847cc8c1ed08636a158f778))
- **sitemap:** implémentes les fonctionnalités pour générer un fichier sitemap.xml ([a9a5afc](https://github.com/solinumasso/soliguide/commit/a9a5afc1f844efb254f85619cb6e444a4d5036ed))
- clear value of input ([315e905](https://github.com/solinumasso/soliguide/commit/315e905c5da523d1c41cf5c330808049fdc5ee26))
- ajout de swagger pour réaliser la doc de l'API ([70837e2](https://github.com/solinumasso/soliguide/commit/70837e27eb339d0864031e9c0626e5a4fb3454eb))
- ajout des icones sur la liste de résultats (wip) ([5dea8e5](https://github.com/solinumasso/soliguide/commit/5dea8e531f149c8a4514619b0166ec24bc449dbc))
- login fonctionnel ✅ ([596f361](https://github.com/solinumasso/soliguide/commit/596f361ea0cc8ea98679297f7a268c87fd624e26))
- manage v0 ([295bf06](https://github.com/solinumasso/soliguide/commit/295bf061d1bf6f4af3479fcf515931cdfcad743f))
- mise à jour de la bdd ([c5bb020](https://github.com/solinumasso/soliguide/commit/c5bb0203c953774d7ce9e182740777b97fbe6ae7))

### Reverts

- Revert "chore(deps): update node.js to v14" ([e025e48](https://github.com/solinumasso/soliguide/commit/e025e48b6a40769c0756de6827551def72c904a7))
- Revert " remove fix airtable " ([cd394ba](https://github.com/solinumasso/soliguide/commit/cd394bada2a150bc53deee2ec02848b39c601fea))

# 1.2.0 (2021-03-26)

### Bug Fixes

- **deps:** update all dependencies ([ca44b53](https://github.com/solinumasso/soliguide/commit/ca44b53118ce41387821bb9dd80786bd96dc6855))
- **upload-doc:** corrige la suppression des docs au niveau des modalities ([bb0633f](https://github.com/solinumasso/soliguide/commit/bb0633fc708305fdc7651ebe4b077e23312d8e78))
- [#97](https://github.com/solinumasso/soliguide/issues/97) modeles de données départements & régions ([1f765e8](https://github.com/solinumasso/soliguide/commit/1f765e8bd625ea8d400096818e39ba9e6d54fb74))
- active la mise à jour de la date de mise à jour des fiches ([e278ca0](https://github.com/solinumasso/soliguide/commit/e278ca06e53c867871c751bb750bed0d905b53b8))
- add / to invite link ([c2c76c2](https://github.com/solinumasso/soliguide/commit/c2c76c2beaa9c3792e8919e7d59452ecfd011a46))
- affichage des publics ([9f84439](https://github.com/solinumasso/soliguide/commit/9f844398382ea0bd23ee4b57443e671c7deb7687))
- Affiche un message de succès quand une invitation est renvoyé ([6097424](https://github.com/solinumasso/soliguide/commit/60974245227b3cc9712f61a1553ed40e97d6df87))
- ajout de description dans les horaires ([73b9c30](https://github.com/solinumasso/soliguide/commit/73b9c300d364549566c5e91e3334a77d18f943be))
- Ajoute les scripts de lancement de tarteaucitron sur les fichiers index.html de la prod et de la preprod ([f7eb124](https://github.com/solinumasso/soliguide/commit/f7eb124ccfe72592ad67f94122907196d779cde3))
- ajoute un bandeau pour spécifier que le site bug ([cd65010](https://github.com/solinumasso/soliguide/commit/cd6501043f4bcb2c93ae6e012d784d719746183a))
- angular.json ([a8ff8eb](https://github.com/solinumasso/soliguide/commit/a8ff8ebe2b060a83546d2f6c932e7f4e21248b4a))
- auth bug ([89bc86e](https://github.com/solinumasso/soliguide/commit/89bc86ed05482409cf760951cadb7dabe9f8470e))
- bouton télécharger le fichier d'orientation ([e21c983](https://github.com/solinumasso/soliguide/commit/e21c983d1613640462ba1ff13e01c67e297fa9c8))
- bug d'affichage ([c1cb722](https://github.com/solinumasso/soliguide/commit/c1cb722d0be9bc687ec89b64f0bf26aea74a75f9))
- bug manage-place ([ddd1bbd](https://github.com/solinumasso/soliguide/commit/ddd1bbdf2e227ba20a577d024e26e1222a82872c))
- categorie range services ([aa54a31](https://github.com/solinumasso/soliguide/commit/aa54a31545ca049af3906ead7c5bb5a3b7cd169b))
- Change la navbar quand l'utilisateur se déconnecte ([dbe6801](https://github.com/solinumasso/soliguide/commit/dbe68019f83da8bda9eb9724e0e12300e013bcf7))
- change le timestamp des places à true ([bf1d510](https://github.com/solinumasso/soliguide/commit/bf1d5106b05624d902a8f177a6ae3ac92b6b153e))
- change les traductions des langues dans la navbar ([9508c53](https://github.com/solinumasso/soliguide/commit/9508c53859ed8d8c59d7bdf5c3ddff00415398d3))
- changement des boutons pour télécharger une fiche d'orientation ([6b1c281](https://github.com/solinumasso/soliguide/commit/6b1c2813ce3fffd0ee06aa744b85e0e37ebe2388))
- changement du nom de public car non utilisable ([1a70b0e](https://github.com/solinumasso/soliguide/commit/1a70b0e40764226db9fd3651a8183fe15f3c863c))
- chemins défectueux ([b879b13](https://github.com/solinumasso/soliguide/commit/b879b13cd567eb4676911c08f9d89cf1cbc55214))
- commentaires ([c4c51cb](https://github.com/solinumasso/soliguide/commit/c4c51cbfa7977271be8aeb6f8208097205137aa8))
- contact mail ([fdea975](https://github.com/solinumasso/soliguide/commit/fdea975ba4226c18fac917e8e7023a3637bdf5ad))
- correction de bugs quand on appuie sur Entrée ([adac448](https://github.com/solinumasso/soliguide/commit/adac448191fb6c7e63602558d1c338fae3accc37))
- correction de l'interface condition ([a0c2669](https://github.com/solinumasso/soliguide/commit/a0c2669333c0c57a084c852a20468fa977565c78))
- correction du terme "public" ([6f160cd](https://github.com/solinumasso/soliguide/commit/6f160cd6e5880590b5ec3ecdbc0ab06e8803b378))
- corrections pour la mise en prod ([feae6e6](https://github.com/solinumasso/soliguide/commit/feae6e6cb11581bcc8260a2d838a414bea96a221))
- corrige l'import de TextInput dans @angular/core qui empêchait la compilation ([6a53196](https://github.com/solinumasso/soliguide/commit/6a5319687397b5aaa052b2a25496365ae7440bd6))
- corrige l'import de TextInput dans @angular/core qui empêchait la compilation ([4ab8346](https://github.com/solinumasso/soliguide/commit/4ab83464f4746d5b7bbcbea6e139247c82c16c75))
- corrige l'upload de photos qui était plus bon avec le refacto du findPlace ([798c32b](https://github.com/solinumasso/soliguide/commit/798c32b948cfda727319d2ccf8f1aea3cfa7edee))
- Corrige la recherche par nom dans le manage-place ([bcfbf47](https://github.com/solinumasso/soliguide/commit/bcfbf477e9f967b03079a3d7905e6eb4e436acdd))
- corrige le css du dropdown du choix des langues ([6e35d6d](https://github.com/solinumasso/soliguide/commit/6e35d6d3a700330ab73308aace358b8d216567ae))
- cron task ([a803b67](https://github.com/solinumasso/soliguide/commit/a803b678b41c0e0c160ef5af11a5418f2fb465e4))
- delete fsevents ([33fb552](https://github.com/solinumasso/soliguide/commit/33fb552bd411f21c2caddaff02fd5398a9b0d061))
- device check date ([b2c0325](https://github.com/solinumasso/soliguide/commit/b2c03254c3254c231f192d665524921bb54ac8fb))
- droits mal gérés sur les éditions de ficheé ([2405843](https://github.com/solinumasso/soliguide/commit/24058437306739d9b59dad1ad67fc8a5623b1543))
- environnement file ([dde3292](https://github.com/solinumasso/soliguide/commit/dde3292860afefae8f76b17d282453130e8462bc))
- environnement file ([f456eef](https://github.com/solinumasso/soliguide/commit/f456eef2713af7a00a0c81cb0c833518fadb85d3))
- erreur api ([1aa23a4](https://github.com/solinumasso/soliguide/commit/1aa23a49938ba2cf8482df5337a89f929caa189d))
- Erreur lors de la premiere recherche ([e28b8d1](https://github.com/solinumasso/soliguide/commit/e28b8d156caaf8819750f837d515f9249998abc8))
- erreurs de chemin ([226414e](https://github.com/solinumasso/soliguide/commit/226414e0407f233fa34481a132e111811674f1cc))
- erreurs de design ([628635b](https://github.com/solinumasso/soliguide/commit/628635b4f0879aa9f7235e7754498e0a98f1d3e5))
- erreurs user.routes.js + changement MEIS +update home ([65ce1bc](https://github.com/solinumasso/soliguide/commit/65ce1bc5ea7cc03696f82dd8d56ef5049a86dfd0))
- first commit ([932195a](https://github.com/solinumasso/soliguide/commit/932195a415f1bef7762e9129c05b9a662aa8befc))
- fix invite pour auto-invite Airtable ([afc999a](https://github.com/solinumasso/soliguide/commit/afc999a1f8ccfe3711835b7c1c95461e87d1001a))
- home ([6f563a8](https://github.com/solinumasso/soliguide/commit/6f563a858d3dfac23ddfadc124d52e85dcc7a480))
- homepage categories ([ad4b6f3](https://github.com/solinumasso/soliguide/commit/ad4b6f34df2c98e13a70abef73d744ff5b485cfc))
- import empechant la compilation ([e385e23](https://github.com/solinumasso/soliguide/commit/e385e232783c59c2a133062a837853ea51d3db75))
- index preprod ([17dd664](https://github.com/solinumasso/soliguide/commit/17dd66446785adbcb2b914f075ebafe13189340c))
- invite AT ([82849e5](https://github.com/solinumasso/soliguide/commit/82849e53f1cc182b56f61008b7ff7e2d3bfec2d5))
- le bouton de deconnexion affiche un curseur clickable ([4f3ce85](https://github.com/solinumasso/soliguide/commit/4f3ce857ac3b4282ddde25f26f4e921a0210f01d))
- manage place (links/publics/conditons) ([b004790](https://github.com/solinumasso/soliguide/commit/b00479022f0492560b5ec43f2c7a3db437c4bf45))
- manque un petit slash ([68ebb1b](https://github.com/solinumasso/soliguide/commit/68ebb1b59afb86f488bcc5302be4498633fd5cdb))
- menu errors ([98bebf1](https://github.com/solinumasso/soliguide/commit/98bebf1b48ccb3610c9e6051025ce65579099aba))
- migrationn des ages ([59777a4](https://github.com/solinumasso/soliguide/commit/59777a4d68a388442eab69d37fd8cc94e15902fd))
- mise à jour des packages ([59b2f7c](https://github.com/solinumasso/soliguide/commit/59b2f7c00d924b680aaee1d9a15added5aca3ba3))
- mise en page des langues + ajout de la petite croix ([02ef82c](https://github.com/solinumasso/soliguide/commit/02ef82c5607397932c990398479ded2f546745e4))
- modalités bug ([a12e5b4](https://github.com/solinumasso/soliguide/commit/a12e5b46b60423995eb9f1e5510fbf59596647b8))
- modalities migration ([99560c7](https://github.com/solinumasso/soliguide/commit/99560c719aa9cf623aa9541bc3b7e4c0764082db))
- module manquant ([d242417](https://github.com/solinumasso/soliguide/commit/d242417e1dddcdba114105915775c20c465f84bc))
- module manquant ([9069840](https://github.com/solinumasso/soliguide/commit/906984015562df970862a763c80716ef623fdc6f))
- module manquant ([974643c](https://github.com/solinumasso/soliguide/commit/974643c86ee0b1b9a97cbe5da57c0017566a7f78))
- modules manquants ([b345b75](https://github.com/solinumasso/soliguide/commit/b345b752ecf9cc34e465bb763e7d9c0b2ae683cd))
- nom de organisation interface ([704fc94](https://github.com/solinumasso/soliguide/commit/704fc949de0f4041b1f98dfbd0b34f911b747e8a))
- ordre des jours dans les horaires ([ce04d08](https://github.com/solinumasso/soliguide/commit/ce04d08e9d3904ae89726d8c00b2ece8fcf6033e))
- package start api ([3792346](https://github.com/solinumasso/soliguide/commit/3792346dfb3b0d2917f84399bf0c249264865d29))
- packages update ([1342406](https://github.com/solinumasso/soliguide/commit/1342406a767b5ba768f79e4f2e72d5d61144f4be))
- preprod build ([6d59068](https://github.com/solinumasso/soliguide/commit/6d5906891d55f9210fe52a46d7f9c1501e10585b))
- prod problems ([65d1f07](https://github.com/solinumasso/soliguide/commit/65d1f079c1f29537abae7bbb0d8c9f4d245076bc))
- readme infos pour les commit ([37286f7](https://github.com/solinumasso/soliguide/commit/37286f78d4e8f03cca48de4dfac3cb286344377b))
- recherche ([aba989f](https://github.com/solinumasso/soliguide/commit/aba989f1385c2b2eee4cfe51129960318322f5c7))
- search ([bfe7dfe](https://github.com/solinumasso/soliguide/commit/bfe7dfe654e16a8b992fe2e1e69f85050d105ed7))
- sentry errors ([6749ef0](https://github.com/solinumasso/soliguide/commit/6749ef05b94c493a07491f8fa49c099554baf9d3))
- **cookies-ga:** retire google analytics du gestionnaire de cookies et l'execute automatiquement ([84daff2](https://github.com/solinumasso/soliguide/commit/84daff2e11e87448de3d802a9af6d6bcce1bcd8a))
- **partners-limitation:** Diminue le délais pour la vérification de la catégorie ([6ec82db](https://github.com/solinumasso/soliguide/commit/6ec82db5c5c2ace5697eb06a70a80da674154b73))
- **partners-limitation:** Fix la limitation des partenaires et de la recherche par catégorie ([ea46284](https://github.com/solinumasso/soliguide/commit/ea462840964e3b94641b4cbfb6662876faafd343))
- **search:** fix la recherche pour les partenaires pour limiter leur action à certaines catégorie ([f14b69e](https://github.com/solinumasso/soliguide/commit/f14b69ed579f7c2acaefa65b73d6cca1a8b8dff2))
- fix la condition d'affichage du bouton page suivante ([111719a](https://github.com/solinumasso/soliguide/commit/111719ad7ca55a8f8cd8af7e2ac62cefb7efa122))
- fix le canEdit ([fdcb31d](https://github.com/solinumasso/soliguide/commit/fdcb31d06002e440b5db84b87106c8f5c80dacac))
- fix le z-index de la navbar pour que ses éléments soient affichés en premier plan ([ef7e5c4](https://github.com/solinumasso/soliguide/commit/ef7e5c4eaab7ebb6d0e9e1a05c090890e1c971db))
- fixe la limit de résultats renvoyés par la recherche à 20 par défaut ([13e876b](https://github.com/solinumasso/soliguide/commit/13e876bbe273e04bc328b6ed4a4d53343a0e24cd))
- initialise la limite de la recherche dans le front à 20 par défaut ([e3383e7](https://github.com/solinumasso/soliguide/commit/e3383e70a3d4488c7ab85b56b7c0c983dad20d15))
- le bouton page suivante ne s'affiche plus quand le nombre de résultat est égale à la limite de resultat ([14fb41b](https://github.com/solinumasso/soliguide/commit/14fb41be6db5982e11b0a30d2234160002559a2a))
- lint ([4cdab41](https://github.com/solinumasso/soliguide/commit/4cdab418b31bd8313194b6164fd15b2a4ffc5156))
- migration des locations ([003d579](https://github.com/solinumasso/soliguide/commit/003d57913bd86cdcdc6adb1207b0f414bfbf8721))
- preprod ([5979acf](https://github.com/solinumasso/soliguide/commit/5979acf4bbd0409029b7d51abf1e8c6cb25359ce))
- problemes de css sur les fiches ([0ca0415](https://github.com/solinumasso/soliguide/commit/0ca0415e4604d4e9c98209e8d6a281ac1add1305))
- remplace un peu saturé par normal pour les services ([1eba053](https://github.com/solinumasso/soliguide/commit/1eba053e32779c9cd419a808525d7e0e228b3d61))
- sentry logs trop complexes + corrections d'affichage ([176a8a9](https://github.com/solinumasso/soliguide/commit/176a8a9a266b64398b8f398de22ea2934a806aa3))
- **navbar:** les drapeaux de la navbar change en fonction de la traduction choisie ([38c099a](https://github.com/solinumasso/soliguide/commit/38c099a17182db2f89374728df4d454e10c8e6c3))
- rends cliquable le lien de renvoie d'invitation sur la liste des utilisateurs invités ([64bb3c6](https://github.com/solinumasso/soliguide/commit/64bb3c6632c9d8e31591ec890d156a69b5e9d41f))
- **crisp:** Rends crisp autorisé de base avec tarte au citron ([054b318](https://github.com/solinumasso/soliguide/commit/054b31879f9db6e01e06b02b7c75c9af8aa85316))
- **invite-member:** empêche les orga d'inviter des membres dont l'email existe déjà ([aab9ac2](https://github.com/solinumasso/soliguide/commit/aab9ac200b72aa8a695e771e2168949c71e64ec5))
- menu ([f1a6215](https://github.com/solinumasso/soliguide/commit/f1a621525f7fc04dd9bf7fc41e3d0daf54f84b50))
- prod issue ([ab3c0dd](https://github.com/solinumasso/soliguide/commit/ab3c0ddc8192cd0e6c1cf225d1f42704bdb5f649))
- recherche failed ([d91390f](https://github.com/solinumasso/soliguide/commit/d91390fd410446b5c026c4b185ee1bd9f85ff85a))
- search in location ([f816eb2](https://github.com/solinumasso/soliguide/commit/f816eb21bcf6b77f80a72403043100d50aabcb2c))
- services names ([63f5256](https://github.com/solinumasso/soliguide/commit/63f5256bc41ee520236e42d1b8ff21f401fd322d))
- timestamps ([6e93b9d](https://github.com/solinumasso/soliguide/commit/6e93b9deff771f3b485f293848333acda5d74ab0))
- translate des horaires ([932f319](https://github.com/solinumasso/soliguide/commit/932f319d489ef7a02924a75ae9b45579e5c1d16c))
- tslint ([891a9d4](https://github.com/solinumasso/soliguide/commit/891a9d41a6e2d6c89a007ad1c58ce70655a94064))
- tslint warning ([eb2439d](https://github.com/solinumasso/soliguide/commit/eb2439db1ecf1d1e78c642169c46ac00369e705e))
- variables nulles empechant la compilation ([10e3d36](https://github.com/solinumasso/soliguide/commit/10e3d3699f5b093d473a42645eaca1f9dafe14c3))
- **deps:** update dependency npm-check-updates to v7 ([a8f0ddd](https://github.com/solinumasso/soliguide/commit/a8f0ddd5d9ea0e061c2f8d9c5167497ec504d9e6))
- **deps:** update dependency winston to v3.3.0 ([193d5e4](https://github.com/solinumasso/soliguide/commit/193d5e477fe229b579acef4c03a2c0814b943a48))
- **general:** correction d'erreurs empêchant le build ([998ddac](https://github.com/solinumasso/soliguide/commit/998ddac0725b443cb5a56a7b4d035ed8ab9b4f06))
- **lint:** correction des soucis de lint sur le front ([0afa5fc](https://github.com/solinumasso/soliguide/commit/0afa5fccd3e65f4b8cc9d5cb7e3027bdf1f4ff2a))
- **place:** correction d'un doublon sur l'interface ([5ae6e33](https://github.com/solinumasso/soliguide/commit/5ae6e332e6947b68023ee9032e447d01db91fcb0))
- **users:** correction du formulaire d'update ([68495f1](https://github.com/solinumasso/soliguide/commit/68495f1d7a44721b13db240fba0ceb46132cda45))
- **users:** hide password ([5a3cb4a](https://github.com/solinumasso/soliguide/commit/5a3cb4af6954be9ace385ca5131c29240f95fe29))
- test ([a795138](https://github.com/solinumasso/soliguide/commit/a7951383c90756773fc30efddfc81f9211542f91))
- tslint et editeur config ([ca7a82a](https://github.com/solinumasso/soliguide/commit/ca7a82a725fdfe85dcaf69bf11fb17bb4f6b2193))
- update ([a2e3dbe](https://github.com/solinumasso/soliguide/commit/a2e3dbe70224c393e711a9ead2b56111788d384c))
- workspaces names ([de5418d](https://github.com/solinumasso/soliguide/commit/de5418d549e06e41dcd45f016cb2ff3471858d01))

### Features

- Ajoute le département 06 au formulaire de contact ([5419b7a](https://github.com/solinumasso/soliguide/commit/5419b7aadce5949513a73039c81130f3efc191b7))
- bascule complète de l'autocomplete côté API ([df00127](https://github.com/solinumasso/soliguide/commit/df001271dcce2c00ef84b3346581b24865c13da6))
- slug des description / titre ([b2eff72](https://github.com/solinumasso/soliguide/commit/b2eff72f99f35df5088e49b9078995a2a58ed24b))
- **admin:** ajout de l'autocomplete des adresses au form ([9f0f393](https://github.com/solinumasso/soliguide/commit/9f0f393399cce16df248e96e2cdd6cbd501f3702))
- **admin:** ajout de l'interface des horaires et des conditions ([d997a87](https://github.com/solinumasso/soliguide/commit/d997a870dcddfce01261773a7bfacbc26da4a0d3))
- **admin:** formulaire étape 1 intégré ([1f6626a](https://github.com/solinumasso/soliguide/commit/1f6626a9480859af40ff1ef1239d4a5082edf3e8))
- **database:** ajout d'un script pour récupérer le dernier dump en un clique ([39c829c](https://github.com/solinumasso/soliguide/commit/39c829c1ab6cdcb4654ca87318826c4f38e684c7))
- **navbar:** ajoute les traductions des langues utilisées dans les fichiers de traduction ([aee4e0d](https://github.com/solinumasso/soliguide/commit/aee4e0db9fd8e883c3250c7551564a01f1410db1))
- **navbar:** change la selection des langues en un dropdown ([73a5eca](https://github.com/solinumasso/soliguide/commit/73a5eca4d1d3cf4e6e84abe7f91f04185797dd22))
- **navbar:** fix le design du dropdown du menu que ça soit sur mobile et sur ordinateur ([0266a5d](https://github.com/solinumasso/soliguide/commit/0266a5dd7ff1ecab072e5b1b0d63f15c312cd1a6))
- **navbar:** modifie les images des langues pour enlever les contours transparents ([bccf7dd](https://github.com/solinumasso/soliguide/commit/bccf7dde74b0d9c6e43f9b648aa11bba98d84d8e))
- ajoute le dropdown 'mon compte' à la navbar collapsed sur mobile ([6956eac](https://github.com/solinumasso/soliguide/commit/6956eac8e24c457d80ba33d792e37086da49e52e))
- **admin:** récupération des données d'une fiche ([9e05d31](https://github.com/solinumasso/soliguide/commit/9e05d31643f7c70c05ec94a227eb0d153cf94530))
- **eslint:** ajout d'une config ESlint qui vérifie la présence des fichiers ([61d1bd7](https://github.com/solinumasso/soliguide/commit/61d1bd7c51ded7c9a4c3be1887a836170db2d1b7))
- **general:** bootstrap is on fire ([6d2fe9c](https://github.com/solinumasso/soliguide/commit/6d2fe9c3f71c00fbea7cb7b031041f34dd37f1e7))
- **horaires:** correction du H24 ([382ecda](https://github.com/solinumasso/soliguide/commit/382ecda675a085f5d92353b7430cb4941a8bbd8d))
- **horaires:** support du 24h24 ([5855ee0](https://github.com/solinumasso/soliguide/commit/5855ee0990111717f33094f4242c96866d8d64e7))
- **interfaces:** mise à jour des interfaces d'horaires ([ee355d1](https://github.com/solinumasso/soliguide/commit/ee355d15db0610c207dc1a096327d8c541c3769d))
- **login:** connexion à l'API réussi ([b9aee12](https://github.com/solinumasso/soliguide/commit/b9aee12ad6fa8a129d66d52a83bc3242970adff3))
- **login:** version 0 de la connexion ([18278ec](https://github.com/solinumasso/soliguide/commit/18278ec29bc0b93345c7f3cc41df8a32d2ee5125))
- **search-filters:** Ajout le component search-filter à la page de recherche ([9aa2375](https://github.com/solinumasso/soliguide/commit/9aa2375faf6bad99032ab8e8adc1401f946e4878))
- **search-filters:** Ajoute le front pour les genres aux filtres ([513e898](https://github.com/solinumasso/soliguide/commit/513e898d486162b50c12030f377b6ccb38e88757))
- **search-filters:** Ajoute le reste des publics aux filtres ([b744253](https://github.com/solinumasso/soliguide/commit/b744253cebfbf77c35ee02fced44440d2919d9a5))
- **search-filters:** Ajoute les filtres pour les animaux de compagnie et les pmr et fix la pagination à 1 de base dans le front ([a0f0dc2](https://github.com/solinumasso/soliguide/commit/a0f0dc232866ad8b0db07fa42327ae90c77d8a42))
- **search-filters:** Ajoute les query parameters dans la recherche au chargement de la page ([7ecc640](https://github.com/solinumasso/soliguide/commit/7ecc640412210ab2a131b75809dc779b6b65d28f))
- **search-filters:** Ajoute un bouton toggle pour les filtres dans le component de la recherche ([0afe47b](https://github.com/solinumasso/soliguide/commit/0afe47b3570ba1256f801ece5c123c0c47eea476))
- **search-filters:** Ajoute une classe css pour tronquer les items des dropdowns du public et ajoute un tooltip pour afficher le texte complet au dessus ([af4555d](https://github.com/solinumasso/soliguide/commit/af4555df3147f1db36e25f0829513d80ce0e9971))
- **search-filters:** Création d'un component pour les filtres dans la recherche ([4a4eb90](https://github.com/solinumasso/soliguide/commit/4a4eb90d72a79e41f9b141d8188315410fd7d321))
- **search-filters:** Envoie les filtres actifs au component chargés des filtres ([6b61ca0](https://github.com/solinumasso/soliguide/commit/6b61ca0ffe6c2c972cc015048082654a0cf577ed))
- **search-filters:** Fix la recherche pour les booléens des modalities ([ae08789](https://github.com/solinumasso/soliguide/commit/ae08789fe406465bd09ef3f1aeebe66e33d98c9b))
- **search-filters:** Implémente tous les filtres des publics et crée une zone distincte dans le front ([2c40961](https://github.com/solinumasso/soliguide/commit/2c409617de0538c1e137c7e8d03877f264bff72a))
- **search-filters:** Le filtre genre marche avec la recherche ([e3bd3b1](https://github.com/solinumasso/soliguide/commit/e3bd3b18e7a864b083c1e25ccb553583b7bd4237))
- **search-filters:** Mets la pagination de la recherche de base à 1 ([8bda187](https://github.com/solinumasso/soliguide/commit/8bda1870a3ebab1e42820260ec04f291c1505a23))
- **search-filters:** Remplace filters.family par filters.familialle pour être plus en cohérence avec la BDD et l'objet search ([5849f2a](https://github.com/solinumasso/soliguide/commit/5849f2a8d7c16632bf8181653c0231e9891a2086))
- **sitemap:** Change l'emplacement du fichier sitemap.xml vers le dossier dist ([b51f2af](https://github.com/solinumasso/soliguide/commit/b51f2afb98592a5fd0aa4a3df7081a3933666583))
- **sitemap:** Change l'emplacement du fichier sitemap.xml vers le dossier dist ([74875aa](https://github.com/solinumasso/soliguide/commit/74875aadc6c778de6b002d7ca8bd2a183affff62))
- **sitemap:** change le path du sitemap.xml pour qu'il soit écrit au niveau du front ([77078a1](https://github.com/solinumasso/soliguide/commit/77078a10d685f1af898fd793b1a585123ea80056))
- **sitemap:** change le path du sitemap.xml pour qu'il soit écrit au niveau du front ([70d3815](https://github.com/solinumasso/soliguide/commit/70d3815b299d43b8a59ab1a4b19a5eab8c13da0b))
- **sitemap:** Implémentation d'un cronjob pour générer un sitemap à jour tous les jours à minuit ([49c6f25](https://github.com/solinumasso/soliguide/commit/49c6f25873eb7db0af67b3674e1c1176d964ce8b))
- **sitemap:** Implémentation d'un cronjob pour générer un sitemap à jour tous les jours à minuit ([a4cb8a4](https://github.com/solinumasso/soliguide/commit/a4cb8a44246b1c0136501ce4102600b5ebd5ae21))
- **sitemap:** Implémentation de la création du fichier sitemap.xml côté API ([5326618](https://github.com/solinumasso/soliguide/commit/53266186df5e3be8b7c14a05fb9df73b48e196e6))
- **sitemap:** Implémentation de la création du fichier sitemap.xml côté API ([5313c0a](https://github.com/solinumasso/soliguide/commit/5313c0a806539994c8def9114df566e34f089439))
- **sitemap:** implémentes les fonctionnalités pour générer un fichier sitemap.xml ([32a2aeb](https://github.com/solinumasso/soliguide/commit/32a2aebc1849fe143847cc8c1ed08636a158f778))
- **sitemap:** implémentes les fonctionnalités pour générer un fichier sitemap.xml ([a9a5afc](https://github.com/solinumasso/soliguide/commit/a9a5afc1f844efb254f85619cb6e444a4d5036ed))
- clear value of input ([315e905](https://github.com/solinumasso/soliguide/commit/315e905c5da523d1c41cf5c330808049fdc5ee26))
- ajout de swagger pour réaliser la doc de l'API ([70837e2](https://github.com/solinumasso/soliguide/commit/70837e27eb339d0864031e9c0626e5a4fb3454eb))
- ajout des icones sur la liste de résultats (wip) ([5dea8e5](https://github.com/solinumasso/soliguide/commit/5dea8e531f149c8a4514619b0166ec24bc449dbc))
- login fonctionnel ✅ ([596f361](https://github.com/solinumasso/soliguide/commit/596f361ea0cc8ea98679297f7a268c87fd624e26))
- manage v0 ([295bf06](https://github.com/solinumasso/soliguide/commit/295bf061d1bf6f4af3479fcf515931cdfcad743f))
- mise à jour de la bdd ([c5bb020](https://github.com/solinumasso/soliguide/commit/c5bb0203c953774d7ce9e182740777b97fbe6ae7))

### Reverts

- Revert "chore(deps): update node.js to v14" ([e025e48](https://github.com/solinumasso/soliguide/commit/e025e48b6a40769c0756de6827551def72c904a7))
- Revert " remove fix airtable " ([cd394ba](https://github.com/solinumasso/soliguide/commit/cd394bada2a150bc53deee2ec02848b39c601fea))
