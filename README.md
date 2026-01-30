# xccelerating-home-search
Xccelerating Real Estate Home Search Landing Page System

## JavaScript Components
`js/components.js` initializes small UI behaviors. All components are optional and safely no-op when the expected elements are missing.

### Mobile Menu
```html
<button data-menu-toggle aria-controls="mobile-menu">Menu</button>
<nav id="mobile-menu" data-mobile-menu>...</nav>
```
- Adds `is-open` on the menu and `is-active` on the toggle.
- Adds `menu-open` on `body` while open.

### Modals
```html
<button data-modal-target="#lead-modal">Open</button>
<div id="lead-modal" class="modal" data-modal>
  <button data-modal-close>Close</button>
  ...
</div>
```
- Adds `is-open` and toggles `aria-hidden`.

### Chat Widget
Place an empty container in the page:
```html
<div id="chat-widget"></div>
```
The script injects a simple widget if the container is empty. You can also provide your own markup using `data-chat-toggle`, `data-chat-panel`, and `data-chat-close`.

### Counter Animation
```html
<div data-counter="250" data-counter-prefix="$"></div>
```
Starts when the element is in view. Optional:
- `data-counter-duration` (ms)
- `data-counter-prefix` / `data-counter-suffix`

### Filter Toggles
```html
<button data-filter-toggle data-filter-target="#filters">Filters</button>
<div id="filters" data-filter-panel>...</div>

<button data-filter-option>New Listings</button>
<button data-filter-clear>Clear</button>
```
Toggles `is-open` on panels and `is-active` on options.
