# Spor MCP — get_spor_tokens snapshot

Source: `@vygruppen/spor-mcp-server` → `get_spor_tokens {"theme":"vyDigital","colorMode":"dark"}`

Applied to: `styles/themes/vy.css`

## Semantic mapping (vyDigital dark → shadcn)

| shadcn                 | Spor token                     | Hex                                            |
| ------------------------| --------------------------------| ------------------------------------------------|
| `--background`         | `bg.DEFAULT` / interstellar    | `#001211`                                      |
| `--foreground`         | `text.DEFAULT`                 | `#FFFFFF`                                      |
| `--card`               | `surface.subtle` / jungle      | `#012622`                                      |
| `--primary`            | `surface.brand` / coralGreen   | `#B2DFD7`                                      |
| `--primary-foreground` | `text.brand` / darkTeal        | `#00453E`                                      |
| `--secondary`          | `surface.neutral` / carbon     | `#363638`                                      |
| `--muted`              | `surface.accent` / pine        | `#00453E`                                      |
| `--muted-foreground`   | `text.neutral.subtle` / silver | `#D7D8D9`                                      |
| `--accent`             | `surface.brand`                | `#B2DFD7`                                      |
| `--destructive`        | `outline.error` / brightRed    | `#D71818`                                      |
| `--ring`               | `outline.focus` / azure        | `#38B49E`                                      |
| `--border`             | `outline.floating`             | `rgba(255,255,255,0.3)` dark / `#EBEBEC` light |
| `--header-nav-active`  | `surface.floating.active`      | `#00453E` dark / `#E5F4F1` light               |
| `--radius`             | Spor `size.border-radius.sm`   | `0.75rem`                                      |

Full raw palette (grey, green, blue, yellow, orange, red, alpha) lives in `vy.css` as `--vy-*` variables.
