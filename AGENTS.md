# AGENTS.md

## Utekos

Dette prosjektet er dedikert til brand.utekos.no.
Prosjektet skal utelukkende inneholde informasjon om merkevaren Utekos sine retningslinjer.

**STATUS:**

Retningslinjene er ikke fastsatt, og siden skal foreløbig benyttes som verktøy til å bestemme de ulike retningslinjene.
Layout og oppsett skal derimot gjennomføres og implementeres uten at siden er rotete eller viser antydning til å være "prototype".

## VY som MAL

Vi setter https://design.vy.no/identitet/ som MAL - og forsøker å sette opp layout omtrent identisk som denne, med samme type innhold og layout-profil.

## Kompleksitet

På bakgrunn av nevnt status, med ulike alternativ til farger, fonter, themes og andre variabler er struktur og kodelogistikk ekstremt viktig for å unng at prosjektet blir uoversiktlig.

## Themes

Det skal opprettes funksjonalitet for å sømløst veksle mellom ulike themes. Skriving av CSS/kode må alltid benytte variabelnavn som benyttes på tvers av alle ulike Themes, slik trykk på knapp fører til hensiktsmessige endringer og videre til den visuell vurderingen som er tenkt.
Viktigste regel for komponentene

Komponenter skal nesten aldri bruke rå brand-farger direkte.

Ikke dette i ProductCard:

```tsx
<Card className="bg-maritime-blue text-cloud-dancer" />
```

Men dette:

```tsx
<Card className="border-border bg-card text-card-foreground" />
```

Og for CTA:

```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />
```

Rå farger som bg-maritime-blue, bg-cloud-dancer, osv. bør primært brukes på brand documentation pages, fargepaletter, swatches og visuelle spesifikasjoner. Selve UI-systemet bør bruke semantiske tokens.

---

## Nettsidens ramme

1. Header

- 1.1 Søkefelt

2. Footer
3. Sidebar venstre
4. TOC høyre
5. Innhold i midten

Tendenserer altså mot en dokumentajsonsside.

#### Color Variable Usage Guide

Each color variable in the base group has a specific purpose in shadcn/ui:

##### Base

| **Variable**                 | **Purpose**                                           |
| ---------------------------- | ----------------------------------------------------- |
| `background`                 | Main application background                           |
| `foreground`                 | Primary text color on the background                  |
| `card`                       | Card component background                             |
| `card-foreground`            | Text and icons within cards                           |
| `popover`                    | Background for dropdown menus and popovers            |
| `popover-foreground`         | Text and icons within popovers                        |
| `primary`                    | Brand color for primary actions (buttons, highlights) |
| `primary-foreground`         | Text and icons on primary-colored elements            |
| `secondary`                  | Less prominent action color                           |
| `secondary-foreground`       | Text and icons on secondary-colored elements          |
| `muted`                      | Subdued background for less important elements        |
| `muted-foreground`           | De-emphasized text (captions, labels)                 |
| `accent`                     | Highlight color for active or focused elements        |
| `accent-foreground`          | Text and icons on accent-colored elements             |
| `destructive`                | Error and deletion action color                       |
| `destructive-foreground`     | Text and icons on destructive-colored elements        |
| `border`                     | Default border color                                  |
| `input`                      | Form inputs and button borders                        |
| `ring`                       | Focus indicator color                                 |
| `chart-1` through `chart-5`  | Data visualization colors                             |
| `sidebar`                    | Sidebar background                                    |
| `sidebar-foreground`         | Text and icons within sidebar                         |
| `sidebar-primary`            | Primary actions within sidebar                        |
| `sidebar-primary-foreground` | Text on sidebar primary elements                      |
| `sidebar-accent`             | Highlighted elements within sidebar                   |
| `sidebar-accent-foreground`  | Text on sidebar accent elements                       |
| `sidebar-border`             | Sidebar divider lines or borders                      |
| `sidebar-ring`               | Focus indicators within sidebar                       |

##### Custom

| **Variable**                         | **Purpose**                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `background dark:input\30`           | Uses `background` in light mode and `input/30` in dark mode                           |
| `accent dark:input\50`               | Uses `accent` in light mode and `input/50` in dark mode                               |
| `background dark:calendar\30`        | Uses `background` in light mode and `calendar/30` in dark mode (calendar UI elements) |
| `accent dark:calendar\50`            | Uses `accent` in light mode and `calendar/50` in dark mode (calendar UI elements)     |
| `input dark:input\80`                | Uses `input` in light mode and `input/80` in dark mode                                |
| `destructive dark:destructive\60`    | Uses `destructive` in light mode and `destructive/60` in dark mode                    |
| `destructive dark:destructive\70`    | Uses `destructive` in light mode and `destructive/70` in dark mode                    |
| `destructive dark:destructive\90`    | Uses `destructive` in light mode and `destructive/90` in dark mode                    |
| `destructive\20 dark:destructive\40` | Uses `destructive/20` in light mode and `destructive/40` in dark mode                 |
| `destructive\40 dark:destructive\60` | Uses `destructive/40` in light mode and `destructive/60` in dark mode                 |
| `dark:input`                         | Applied when the UI element explicitly uses the `dark:input` class                    |
| `outline`                            | Used for focus effects                                                                |
| `outline\10 dark:outline\20`         | Uses `outline/10` in light mode and `outline/20` in dark mode                         |
