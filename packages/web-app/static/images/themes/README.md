# Theme assets

One directory per theme, named after the `Themes` enum value in
`@soliguide/common`. File names are fixed, so a theme only has to declare its
directory (`ThemeMedia.assetsDirectory`) and adding a country never touches a
component.

```
<theme>/logo.svg
<theme>/logo-inline.svg
<theme>/logo-symbol.svg
<theme>/illustration-home.svg
<theme>/illustration-favorites.svg
<theme>/illustration-language-selection.svg
```

## Pending artwork

The Soliguia directories currently ship placeholders so that nothing 404s.
Replacing them is a pure file swap, with no code change:

| File                                  | `soliguia_es` / `soliguia_ad` status                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `logo.svg`, `logo-inline.svg`         | Final Soliguia artwork                                                                                                        |
| `logo-symbol.svg`                     | Soliguide symbol — no Soliguia symbol exists yet, the Angular frontend falls back the same way                                |
| `illustration-home.svg`               | Placeholder, Soliguide artwork                                                                                                |
| `illustration-favorites.svg`          | Placeholder, Soliguide artwork                                                                                                |
| `illustration-language-selection.svg` | Placeholder, Soliguide artwork — a dedicated illustration is an explicit requirement of the "Ajustement de la Web App" ticket |

Favicons are still shared across themes (`static/favicon/`), as they are in the
Angular frontend. A per-theme favicon set needs Soliguia icons first.
