# Enjoying code with the Web-App

This document is long overdue, and describes how the web-app is structured, and proposes development guidelines,
to ensure the app remains simple to understand, extend and fix

## Description of the app architecture

The architecture is a naive implementation of a Clean Architecture (mostly because Controller and Use case layers are somewhat merged).

The principles used here are not specific to Svelte nor Javascript, they can be transposed to any language.

The main goal is to have separate blocks with very specific responsibilities, organized as onion layers.

Each layer has no knowledge about its surrounding layer.

### Description of the layers, from center to exterior

#### domain: entities, models, business logic. How business concepts are structured and updated

Capable of creating business objects by transforming raw data. This data can have behaviour only if
this behaviour has business meaning. For example in an invoice, a function calculating a discount based on other parameters.

If Svelte is removed, this part survives and keeps having meaning. There is no relation between this layer and Svelte.

**This layer does not know about controllers or services** but it can be used by them (ie when a service needs to transform
its raw response into some business object)

#### controllers: app state and use cases entry points

The place where most of the magic happens. This layer aggregates models and services, and encapsulates the app rules.

The controllers do two things:

- maintain a state and expose it
- expose functions that can alter the state

The state is a Svelte store (but it is not a requirement ; we use them because they are reactive, so it is easier in the UIs),
but we expose it only partially: only the `subscribe` function is exported, otherwise the store would be read-write and
its integrity wouldn't be guaranteed (we could cheat).

The functions that are exposed are use-case entry points. They need to match with a business need (99% of the time).
For example, select a location suggestion in the Search page
These functions sometimes use services, because they need to perform actions that are in another layer / outside the app.

The controller has no knowledge of its outside layer (services), it only knows their interfaces and the service instances
are provided (injected) to the controller closure (ie `getPageController`). So when it comes to testing, it is easy:
replace the service instance by a simple function that respects the service interface. That's it

Apart from the Svelte stores (can be replaced by an equivalent system), these controllers have no knowledge about frameworks.
If one day sveltekit is obsolete, this part can survive.

#### Services

Interaction with outside world. Mostly by calling other services, or by using libs like Posthog, Zendesk

Each service has its own Interface that is used by the controllers (never rely on the concrete implementation)

The services are only functions in their closure. Their dependencies are injected, as in the controllers.
It is a matter of separation of concerns and testability

The services do not know anything about controllers

The services are not related to Svelte or Sveltekit.

### Lib

In the lib folder, we have a lot of things. Because it is very convenient to import resources using `$lib` shorthand.

We do not use an `Utils` file because it is too generic and becomes cluttered very fast.
Instead, we use small topic-specific files that expose utility functions, preferably pure (no side-effects, relies on its parameters only).

The lib folder also contains components that are shared across pages, services, models, and `server` folder.
This one has meaning in sveltekit: this code it contains is executed only in backend side, and it can use private environment variables.
That is why we put here backend services, used by the sveltekit api endpoints.

### Data flow

The page (is dumb and makes no decision) exposes the state and its controls allow the user to trigger use cases.
Then the controllers process the data and delegate actions to services, that can use external systems.
When data comes, it goes the other way aroud, at the end, the UI displays a result

In clean architecture language, the UI is a primary adapter: from it we enter into the system.
The services are secondary adapters: with them, the app can communicate with external systems.

All these concepts are abstractions: the UI can be replaced by another one, same for the services. The core still works

### Improvements

The current architecture isn't perfect, it can be improved, for example by being closer to the real Clean Architecture.
The simplicifations are due to the size of the app, it would have caused too many indirections in the code.

Some layers are aggregated and can be separated when the app is big enough, some controllers can exist without being tied to a page,
some model entities can start to contain business behaviour, ...

The architecure is made to isolate pieces in a way that favors loose coupling between them, and segregates responsibilities the most possible,
so when the time comes and it needs to evolve, it is easy to do so.

## Misc

## Code review

The above chapter is not sufficient when doing a code review, there are other guidelines or advice that are useful to know:

### CSS

- use absolute positioning only when necessary
- use css flow, do not think the UI as a grid. Elements are just stacked inline or in blocks
- Remember that some complicated tweaks are needed just because a parent has bad css. Look up when it becomes dirty

### JS

- functions must be small, simple and have a single responsibility
- compose self-contained building blocks.

### Svelte / UI

- UI must be as dumb as possible: controller makes the calculations, the UI displays and triggers use-cases (ie calls functions exposed by the controller)
- controller code is easy to test because there is no DOM, UI or async rendering to handle.

## Architecture

- we shouldn't be able to cheat with the state: each state change in a controller must always produce a new valid state

## Tests

- Think about testability when creating services or components
- Inject dependencies, so they can be replaced in the unit tests. Also because these dependencies are not what we test
- When testing a page (ie its controller), start with the acceptance tests written into the issue: they help to focus on the purpose.
- Always test the intentions (see user actions in acceptance tests), not the implementation
- Start with the tests, the UI can come later
