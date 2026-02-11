# Accessibility Brainstorm: vue3-layerboard & openmaps

_Date: 2026-02-09_
_Status: Brainstorm — no decisions finalized, no implementation started_

## Legal Context

- ADA Title II final rule (April 2024) requires state/local government web content to conform to **WCAG 2.1 Level AA**
- Compliance deadline: **April 24, 2026**
- Philadelphia has an existing accessibility policy and is working toward compliance

## Architecture Context

openmaps uses @phila/layerboard (from vue3-layerboard) and @phila/phila-ui-map-core (from phila-ui-4/packages/map-core). This is the newer stack — no phila-ui-3 dependencies. The whole stack is modern and under our control.

## The Good News

**vue3-layerboard** is a panel with checkboxes, dropdowns, and layer groups — standard UI components. Making this accessible is very doable. No phila-ui-3 vendor component blockers.

**map-core** accessibility is already brainstormed separately (see `phila-ui-4/packages/map-core/docs/plans/2026-02-09-accessibility-brainstorm.md`). Covers map container labeling, control button ARIA, hiding Cyclomedia/Pictometry from assistive tech, and focus management.

**openmaps controls** (search, layer toggles, buttons) — all achievable.

## The Hard Problem

openmaps is fundamentally a **map exploration tool**. Unlike pinboard (which has a list view) or atlas (which has data panels), openmaps' core value is visual spatial exploration — toggle map layers, look at zoning, aerial imagery, parcels, etc.

There is no natural "accessible alternative" for this. A blind user cannot meaningfully explore a zoning map or aerial imagery. The data exists in the layers, but presenting it non-visually would require an entirely different interface.

## What Can Be Done Within layerboard and openmaps

### Layerboard panel accessibility (very doable)

- Layer group expand/collapse needs `aria-expanded`
- Layer checkboxes need proper labels and `aria-checked`
- Layer group headers need keyboard support
- Panel itself needs landmark role and `aria-label`
- Focus management when panel opens/closes
- `:focus-visible` styles on all interactive elements

### openmaps controls (doable)

- Search bar accessibility (labels, announcements)
- Map container labeled with `role="img"` and `aria-label` describing the tool
- All buttons get `aria-label`, toggles get `aria-pressed`
- Screen reader users can navigate controls and skip past the map

### What requires a product/policy decision

- **Does openmaps need an alternative non-visual way to access the underlying data?** The map layers show things like zoning districts, parcels, flood zones, etc. If a resident needs this information, is the map the only way to get it, or do other city resources (phila.gov pages, PDF documents, phone services) provide the same data?
- If openmaps must provide accessible data access itself, that would mean building something like a "query by address" feature that returns text descriptions of what layers show at that location — a significant product decision, not just an a11y retrofit.

## Summary

| Area                                   | Feasibility              | Blocked?                      |
| -------------------------------------- | ------------------------ | ----------------------------- |
| Layerboard panel controls              | Very doable              | No                            |
| Map-core controls (buttons, popups)    | Doable                   | No                            |
| openmaps search and UI controls        | Doable                   | No                            |
| Visual map exploration for blind users | Not possible             | Fundamental limitation        |
| Alternative data access for openmaps   | Possible but significant | Needs product/policy decision |

## Cross-References

- map-core accessibility brainstorm: `phila-ui-4/packages/map-core/docs/plans/2026-02-09-accessibility-brainstorm.md`
- vue3-pinboard accessibility brainstorm: `vue3-pinboard/docs/plans/2026-02-09-accessibility-brainstorm.md`
- vue3-atlas accessibility brainstorm: `vue3-atlas/docs/plans/2026-02-09-accessibility-brainstorm.md`
