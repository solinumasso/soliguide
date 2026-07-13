# Contributing to Web-app

Make sure you are familiar with the information contained in the parent `CONTRIBUTING.md` file located at the root folder of the Soliguide project.

This file presents how the web-app is structured and provides guidelines to the contributors.

## Folder structure

See https://kit.svelte.dev/docs/project-structure for general info.

```
// Root folders and files
src
├── lib       // utilities and components
├── routes
├── styles    // global scss styles
└── app.html
```

`static` folder is outside src, it contains static assets used in index.html

```
// Lib folder
lib
├── components      // reused components
├── images
├── js              // js utilities for frontend
├── server          // js files for server-side only
└── components
```

## Architecture

The app architecture is meant to be easy to reason with. The main rules are:

- have the needed code as close as where it is used
- when a component or a file is reused, it is hoisted at the level immediately visible by its consumers
- When a component or a file is not reused, it is nested

This organization ensures that a subtree can be moved with no excessive refactoring needed.

Separate business logic and UI as much as possible to ease testability

Utilities: `util` namespace is not allowed. Prefer small topic-oriented namespaces, i.e `mail`, `date`, `text`, `media`
