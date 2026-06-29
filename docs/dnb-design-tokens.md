---
id: dnb-design-tokens
title: DNB/Eufemia Design Tokens
description: Local Eufemia design-token snapshot for Utekos Brand theme work. Verify against Eufemia MCP before implementation decisions.
doc_type: design-token-snapshot
source: Eufemia MCP /uilib/usage/customisation/theming/design-tokens/colors.md
source_package: "@dnb/eufemia"
version: 11.8.0
generated_at: 2026-06-26T12:38:10.554Z
checksum: 090b7d977ba4be5e2c4c04d199a30a4048416c59f443a56985df2f80629d9c40
status: local-snapshot
verification_required: true
verification_tool: Eufemia MCP
---

**Beta:** The `--token-*` CSS custom properties are currently in beta. We encourage you to start using them and welcome your feedback. The token API may still change, but any breaking changes will be clearly communicated.

---

## Overview

```tsx
render(
  <Table>
    <thead>
      <Tr>
        <Th>Section</Th>
        <Th>Tokens</Th>
        <Th>Usage</Th>
      </Tr>
    </thead>
    <tbody>
      {colorSections.map((section) => {
        return (
          <Tr key={section.id}>
            <Td>
              <Anchor
                href={`/uilib/usage/customisation/theming/design-tokens/colors/#${section.id}`}
              >
                {section.title}
              </Anchor>
            </Td>
            <Td>{section.tokens.length}</Td>
            <Td>
              {section.id === "component"
                ? "For internal use only."
                : section.id === "decorative"
                  ? "For advanced custom decorative needs."
                  : "For external use. Use the filters in each section to narrow tokens to the variants you need."}
            </Td>
          </Tr>
        );
      })}
    </tbody>
  </Table>,
);
```

### Tips

- Hover over the value of a token in the tables below to see its **Eufemia Foundation** name.
- Use the filter buttons above each table to narrow tokens by modifier (for example `inverse`, `ondark`, `subtle`, `bold`, or `static`). Multiple modifiers combine with `AND`.
- You can sort the tables by clicking the column headers. Click again to reverse the sort order.

---

## Background

Background tokens are used for surfaces, fills, and interactive fill states. Typical semantic names in this section include `action`, `neutral`, `selected`, and `page`.

| Group                           | Token                                                      | DNB Light | DNB Dark  | Sbanken Light | Sbanken Dark | Carnegie            |
| ------------------------------- | ---------------------------------------------------------- | --------- | --------- | ------------- | ------------ | ------------------- |
| action                          | `--token-color-background-action`                          | `#007272` | `#A5E1D2` | `#4E08BC`     | `#64D7B4`    | `#000000`           |
| action-alternative              | `--token-color-background-action-alternative`              | `#8E8E93` | `#737373` | `#9090A3`     | `#9090A3`    | `#000000`           |
| action-alternative-hover-subtle | `--token-color-background-action-alternative-hover-subtle` | `#EBEBEB` | `#48484A` | `#F2F2F7`     | `#4A4A5B`    | `#EBEBEB`           |
| action-disabled                 | `--token-color-background-action-disabled`                 | `#CCCCCC` | `#48484A` | `#EBEBF1`     | `#4A4A5B`    | `#CCCCCC`           |
| action-disabled-ondark          | `--token-color-background-action-disabled-ondark`          | `#48484A` | `#48484A` | `#666578`     | `#4A4A5B`    | `#48484A`           |
| action-focus                    | `--token-color-background-action-focus`                    | `#276ACE` | `#276ACE` | `#005CFF`     | `#005CFF`    | `#276ACE`           |
| action-focus-subtle             | `--token-color-background-action-focus-subtle`             | `#F2F2F5` | `#F2F2F5` | `#EBF6FF`     | `#EBF6FF`    | `#F2F2F5`           |
| action-hover                    | `--token-color-background-action-hover`                    | `#007272` | `#A5E1D2` | `#4E08BC`     | `#64D7B4`    | `#333333`           |
| action-hover-inverse            | `--token-color-background-action-hover-inverse`            | `#A5E1D2` | `#007272` | `#92EECD`     | `#4E08BC`    | `#B1B1B5`           |
| action-hover-ondark             | `--token-color-background-action-hover-ondark`             | `#A5E1D2` | `#A5E1D2` | `#92EECD`     | `#92EECD`    | `#FFFFFF`           |
| action-hover-subtle             | `--token-color-background-action-hover-subtle`             | `#D8F3EC` | `#023939` | `#F1EBFF`     | `#16342D`    | `rgba(0 0 0 / 5%)`  |
| action-hover-subtle-inverse     | `--token-color-background-action-hover-subtle-inverse`     | `#023939` | `#D8F3EC` | `#222163`     | `#F1EBFF`    | `#000000`           |
| action-hover-subtle-ondark      | `--token-color-background-action-hover-subtle-ondark`      | `#08454D` | `#08454D` | `#16342D`     | `#16342D`    | `rgba(0 0 0 / 30%)` |
| action-inverse                  | `--token-color-background-action-inverse`                  | `#A5E1D2` | `#007272` | `#92EECD`     | `#4E08BC`    | `#B1B1B5`           |
| action-ondark                   | `--token-color-background-action-ondark`                   | `#A5E1D2` | `#A5E1D2` | `#92EECD`     | `#92EECD`    | `#FFFFFF`           |
| action-pressed                  | `--token-color-background-action-pressed`                  | `#14555A` | `#5CBDAD` | `#1C1B4E`     | `#37B992`    | `#000000`           |
| action-pressed-ondark           | `--token-color-background-action-pressed-ondark`           | `#5CBDAD` | `#5CBDAD` | `#64D7B4`     | `#64D7B4`    | `#FFFFFF`           |
| action-pressed-subtle           | `--token-color-background-action-pressed-subtle`           | `#BCE8DC` | `#14555A` | `#E0D0FF`     | `#0D1F1B`    | `rgba(0 0 0 / 10%)` |
| action-pressed-subtle-inverse   | `--token-color-background-action-pressed-subtle-inverse`   | `#14555A` | `#BCE8DC` | `#1C1B4E`     | `#E0D0FF`    | `#333333`           |
| action-pressed-subtle-ondark    | `--token-color-background-action-pressed-subtle-ondark`    | `#14555A` | `#14555A` | `#0D1F1B`     | `#0D1F1B`    | `rgba(0 0 0 / 50%)` |
| error                           | `--token-color-background-error`                           | `#D52525` | `#D52525` | `#D8134B`     | `#DF280F`    | `#D52525`           |
| error-subtle                    | `--token-color-background-error-subtle`                    | `#FCEEEE` | `#401A1A` | `#FFDBE9`     | `#3C010B`    | `#FCEEEE`           |
| info                            | `--token-color-background-info`                            | `#007272` | `#A5E1D2` | `#1E9F73`     | `#64D7B4`    | `#007272`           |
| info-subtle                     | `--token-color-background-info-subtle`                     | `#F2F4EC` | `#1C342D` | `#F4FFFB`     | `#16342D`    | `#EBF4F2`           |
| marketing                       | `--token-color-background-marketing`                       | `#333333` | `#F8F8F8` | `#222163`     | `#E0D0FF`    | `#333333`           |
| marketing-subtle                | `--token-color-background-marketing-subtle`                | `#F2F2F5` | `#48484A` | `#F1EBFF`     | `#3A3A4A`    | `#F2F2F5`           |
| neutral                         | `--token-color-background-neutral`                         | `#FFFFFF` | `#1C1C1E` | `#FFFFFF`     | `#21202D`    | `#FFFFFF`           |
| neutral-alternative             | `--token-color-background-neutral-alternative`             | `#F2F2F5` | `#333333` | `#EBEBF1`     | `#161620`    | `#F2F2F5`           |
| neutral-base                    | `--token-color-background-neutral-base`                    | `#EBEBEB` | `#333333` | `#F2F2F7`     | `#4A4A5B`    | `#EBEBEB`           |
| neutral-bold                    | `--token-color-background-neutral-bold`                    | `#CCCCCC` | `#48484A` | `#D9D9E4`     | `#666578`    | `#CCCCCC`           |
| neutral-static                  | `--token-color-background-neutral-static`                  | `#FFFFFF` | `#FFFFFF` | `#FFFFFF`     | `#FFFFFF`    | `#FFFFFF`           |
| neutral-subtle                  | `--token-color-background-neutral-subtle`                  | `#F8F8F8` | `#2C2C2E` | `#F9F9FD`     | `#3A3A4A`    | `#F8F8F8`           |
| page-background                 | `--token-color-background-page-background`                 | `#FFFFFF` | `#000000` | `#FFFFFF`     | `#161620`    | `#FFFFFF`           |
| positive                        | `--token-color-background-positive`                        | `#007B5E` | `#47D197` | `#00785B`     | `#64D7B4`    | `#007B5E`           |
| positive-subtle                 | `--token-color-background-positive-subtle`                 | `#EBF4F2` | `#1C342D` | `#E5FFF7`     | `#16342D`    | `#EBF4F2`           |
| selected                        | `--token-color-background-selected`                        | `#08454D` | `#E4EED7` | `#1C1B4E`     | `#E5FFF7`    | `#000000`           |
| selected-ondark                 | `--token-color-background-selected-ondark`                 | `#D8F3EC` | `#D8F3EC` | `#E5FFF7`     | `#E5FFF7`    | `#FFFFFF`           |
| selected-subtle                 | `--token-color-background-selected-subtle`                 | `#E4EED7` | `#0D4637` | `#F1EBFF`     | `#16342D`    | `#F6EAE4`           |
| selected-subtle-ondark          | `--token-color-background-selected-subtle-ondark`          | `#0D4637` | `#0D4637` | `#16342D`     | `#16342D`    | `#000000`           |
| warning                         | `--token-color-background-warning`                         | `#FDBB31` | `#FDBB31` | `#F7BF16`     | `#F7BF16`    | `#FDBB31`           |
| warning-subtle                  | `--token-color-background-warning-subtle`                  | `#FBF6EC` | `#3D2E0F` | `#FFFCE5`     | `#312500`    | `#FBF6EC`           |

## Text

Text tokens are used for readable content, labels, and text states.

| Group                       | Token                                            | DNB Light | DNB Dark  | Sbanken Light | Sbanken Dark | Carnegie  |
| --------------------------- | ------------------------------------------------ | --------- | --------- | ------------- | ------------ | --------- |
| action                      | `--token-color-text-action`                      | `#007272` | `#A5E1D2` | `#4E08BC`     | `#92EECD`    | `#000000` |
| action-alternative-ondark   | `--token-color-text-action-alternative-ondark`   | `#FFFFFF` | `#FFFFFF` | `#FFFFFF`     | `#FFFFFF`    | `#FFFFFF` |
| action-disabled             | `--token-color-text-action-disabled`             | `#CCCCCC` | `#636366` | `#D9D9E4`     | `#666578`    | `#CCCCCC` |
| action-disabled-ondark      | `--token-color-text-action-disabled-ondark`      | `#8E8E93` | `#8E8E93` | `#9090A3`     | `#9090A3`    | `#8E8E93` |
| action-focus                | `--token-color-text-action-focus`                | `#276ACE` | `#276ACE` | `#005CFF`     | `#005CFF`    | `#276ACE` |
| action-hover                | `--token-color-text-action-hover`                | `#007272` | `#A5E1D2` | `#4E08BC`     | `#92EECD`    | `#000000` |
| action-hover-inverse        | `--token-color-text-action-hover-inverse`        | `#A5E1D2` | `#007272` | `#92EECD`     | `#4E08BC`    | `#FFFFFF` |
| action-hover-ondark         | `--token-color-text-action-hover-ondark`         | `#A5E1D2` | `#A5E1D2` | `#92EECD`     | `#92EECD`    | `#FFFFFF` |
| action-inverse              | `--token-color-text-action-inverse`              | `#A5E1D2` | `#007272` | `#92EECD`     | `#4E08BC`    | `#FFFFFF` |
| action-ondark               | `--token-color-text-action-ondark`               | `#A5E1D2` | `#A5E1D2` | `#92EECD`     | `#92EECD`    | `#FFFFFF` |
| action-pressed              | `--token-color-text-action-pressed`              | `#14555A` | `#5CBDAD` | `#222163`     | `#64D7B4`    | `#000000` |
| action-pressed-inverse      | `--token-color-text-action-pressed-inverse`      | `#5CBDAD` | `#14555A` | `#64D7B4`     | `#222163`    | `#FFFFFF` |
| action-pressed-ondark       | `--token-color-text-action-pressed-ondark`       | `#5CBDAD` | `#5CBDAD` | `#64D7B4`     | `#64D7B4`    | `#FFFFFF` |
| error                       | `--token-color-text-error`                       | `#D52525` | `#FF4646` | `#D8134B`     | `#FF3C64`    | `#D52525` |
| error-inverse               | `--token-color-text-error-inverse`               | `#FF5400` | `#D52525` | `#FF5B44`     | `#3C010B`    | `#ED4C4C` |
| neutral                     | `--token-color-text-neutral`                     | `#333333` | `#FFFFFF` | `#18172A`     | `#FFFFFF`    | `#000000` |
| neutral-alternative         | `--token-color-text-neutral-alternative`         | `#737373` | `#8E8E93` | `#666578`     | `#9090A3`    | `#737373` |
| neutral-alternative-inverse | `--token-color-text-neutral-alternative-inverse` | `#CCCCCC` | `#636366` | `#C0C0D1`     | `#666578`    | `#CCCCCC` |
| neutral-inverse             | `--token-color-text-neutral-inverse`             | `#FFFFFF` | `#333333` | `#FFFFFF`     | `#18172A`    | `#FFFFFF` |
| neutral-ondark              | `--token-color-text-neutral-ondark`              | `#FFFFFF` | `#FFFFFF` | `#FFFFFF`     | `#FFFFFF`    | `#FFFFFF` |
| neutral-onlight             | `--token-color-text-neutral-onlight`             | `#333333` | `#333333` | `#18172A`     | `#000000`    | `#000000` |
| neutral-subtle              | `--token-color-text-neutral-subtle`              | `#CCCCCC` | `#636366` | `#666578`     | `#666578`    | `#CCCCCC` |
| neutral-subtle-ondark       | `--token-color-text-neutral-subtle-ondark`       | `#CCCCCC` | `#CCCCCC` | `#EBEBF1`     | `#EBEBF1`    | `#CCCCCC` |
| positive                    | `--token-color-text-positive`                    | `#007B5E` | `#28B482` | `#00785B`     | `#64D7B4`    | `#007B5E` |
| positive-inverse            | `--token-color-text-positive                     |           |           |               |              |           |

---

# Dark mode guide

Dark mode changes the active color scheme. It does not change how you choose semantic tokens.

Start with the same semantic token family you would use in light mode, then adjust only when the surface relationship changes:

- Use the base token when the content sits on the current color scheme's default surface.
- Use the `inverse` variant when the content sits on a surface that follows the opposite color scheme.
- Use the `ondark` variant when the content sits on a local dark surface, regardless of the surrounding color scheme.

## Choosing the right variant

### Base tokens follow the current scheme

`--token-color-text-neutral`, `--token-color-icon-neutral`, `--token-color-text-action`, and `--token-color-icon-action` are the default choice for content that lives on the page's normal surface.

If the application changes from light mode to dark mode, those same token names adapt automatically. In most cases, this is all you need.

### `inverse` is for the opposite scheme

Use `inverse` when the surrounding surface should feel like the opposite color scheme.

Typical examples are overlays, promotional blocks, or embedded areas that intentionally contrast with the current page mode. The token keeps the semantic role, but flips the contrast relationship.

### `ondark` is for local dark surfaces

Use `ondark` when the background is dark because of the component or section itself, not because the whole app switched to dark mode.

That distinction matters because a local dark card inside light mode and a full dark-mode page are not the same thing. `ondark` communicates that the content must stay readable on a dark surface in either case.

### Variant behavior in each scheme

#### Light color scheme

Use the base token on the current surface, switch to `inverse` when the surface follows the opposite scheme, and use `ondark` for a local dark surface.

#### Dark color scheme

The same semantic token names adapt automatically in dark mode. Only `inverse` and `ondark` change the surface relationship.

### Color token swatches

```tsx
render(
  <div style={darkModeGridStyle}>
    {schemes.map((scheme) => (
      <Card key={scheme} title={scheme === "dark" ? "Dark color scheme" : "Light color scheme"}>
        <Theme colorScheme={scheme}>
          <Flex.Stack gap="small">
            {darkModeSwatchRows.map((row) => (
              <DarkModeCard key={`${scheme}-${row.label}`} scheme={scheme} row={row} />
            ))}
          </Flex.Stack>
        </Theme>
      </Card>
    ))}
  </div>,
);
```

## Radius

Radius tokens control border-radius values across themes. They map to foundation size values and may differ between brands.

| Token                 | DNB Light  | DNB Dark   | Sbanken Light | Sbanken Dark | Carnegie   |
| --------------------- | ---------- | ---------- | ------------- | ------------ | ---------- |
| `--token-radius-0`    | `0`        | `0`        | `0`           | `0`          | `0`        |
| `--token-radius-xs`   | `0.125rem` | `0.125rem` | `0.125rem`    | `0.125rem`   | `0`        |
| `--token-radius-sm`   | `0.25rem`  | `0.25rem`  | `0.25rem`     | `0.25rem`    | `0.125rem` |
| `--token-radius-md`   | `0.5rem`   | `0.5rem`   | `0.5rem`      | `0.5rem`     | `0.125rem` |
| `--token-radius-lg`   | `1rem`     | `1rem`     | `1rem`        | `1rem`       | `0.25rem`  |
| `--token-radius-xl`   | `1.5rem`   | `1.5rem`   | `1.5rem`      | `1.5rem`     | `1.5rem`   |
| `--token-radius-full` | `9999px`   | `9999px`   | `9999px`      | `9999px`     | `9999px`   |

## Practical rule

Choose the token by semantic role first, then by surface relationship:

1. Is this neutral content or action content?
2. Is it on the current scheme, the opposite scheme, or a local dark surface?
3. Pick the base, `inverse`, or `ondark` variant accordingly.

If you are styling Eufemia components, prefer `surface="dark"` where supported. Components already switch to the correct `ondark` variants automatically.

## Common pattern

Dark mode tokens are not included in the default theme import. Import the extra dark mode stylesheet before using `colorScheme`:

```tsx
// DNB theme
import "@dnb/eufemia/style/themes/ui/ui-theme-dark-mode.min.css"; // Use --isolated.min.css for style isolation

// Sbanken theme
import "@dnb/eufemia/style/themes/sbanken/sbanken-theme-dark-mode.min.css"; // Use --isolated.min.css for style isolation
```

For runtime setup, persistence, and SSR details, see the [`colorScheme` property](/uilib/usage/customisation/theming/theme/#the-colorscheme-property-dark-mode).

If you render on the server, also read [Preventing dark mode flash (FOUC)](/uilib/usage/customisation/theming/theme/#preventing-dark-mode-flash-fouc).

When your app switches the whole UI to dark mode, keep using the base semantic tokens once the dark mode stylesheet is loaded:

```tsx
import { Theme } from "@dnb/eufemia/shared";

render(
  <Theme colorScheme="dark">
    <App />
  </Theme>,
);
```

When a single component can appear on a dark surface, swap only the local token references:

```scss
.my-card {
  --card-text-color: var(--token-color-text-neutral);
  --card-icon-color: var(--token-color-icon-neutral);
}

.my-card--on-dark {
  --card-text-color: var(--token-color-text-neutral-ondark);
  --card-icon-color: var(--token-color-icon-neutral-ondark);
}

.my-card__title {
  color: var(--card-text-color);
}

.my-card__icon {
  color: var(--card-icon-color);
}
```

Use the same pattern for action-colored content:

```scss
.my-link-card {
  --card-link-color: var(--token-color-text-action);
  --card-link-icon-color: var(--token-color-icon-action);
}

.my-link-card--inverse {
  --card-link-color: var(--token-color-text-action-inverse);
  --card-link-icon-color: var(--token-color-icon-action-inverse);
}

.my-link-card--on-dark {
  --card-link-color: var(--token-color-text-action-ondark);
  --card-link-icon-color: var(--token-color-icon-action-ondark);
}
```
