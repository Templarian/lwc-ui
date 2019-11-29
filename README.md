# lwc-ui

Minimal UI Components for Prototypes. [View Demo](https://templarian.github.io/lwc-ui/)

## Install

```bash
npm install lwc-ui
```

## Components

### Attention - `ui-attention`

```html
<ui-attention variant="danger">
  <ui-icon slot="left" path={mdiAlertOctagon}></ui-icon>
  Attention danger text.
</ui-attention>
```

| Slot    | Components |
| ------- | ---------- |
| `left`  | `ui-icon`  |
| default | Text       |
| `right` | `ui-icon`  |

### Badge - `ui-badge`

Work in Progress...

```html
<ui-button>
  Button with Badge
  <ui-badge slot="right">42</ui-badge>
</ui-button>
```

### Button - `ui-button`

```html
<ui-button>
  <ui-icon slot="left" path={mdiAccount}></ui-icon>
  Account Button
</ui-button>
```

| Attribute  | Default | Values                    |
| ---------- | ------- | ------------------------- |
| `block`    | `false` | `true`, `false`           |
| `onclick`  | n/a     | `MouseEvent`              |
| `active`   | `null`  | index or `ui-button` name |
| `onactive` | n/a     | `{ detail: true }`        |

### ButtonGroup - `ui-button-group`

```html
<ui-button-group>
  <ui-button>Button 1</ui-button>
  <ui-button>Button 2</ui-button>
</ui-button-group>
```

| Attribute  | Default | Values                                |
| ---------- | ------- | ------------------------------------- |
| `block`    | `false` | `true`, `false`                       |
| `active`   | `null`  | index or `ui-button` name             |
| `onactive` | n/a     | `{ detail: { index: 0, name: null }}` |

> Note: `active` must be set for `onactive` to trigger.

### Card - `ui-card`

Cards can section content.

```html
<ui-card>
  <ui-card-header>
    Header
  </ui-card-header>
  <ui-card-body>
    <p>Hello!</p>
  </ui-card-body>
  <ui-card-footer>
    Footer
  </ui-card-footer>
</ui-card>
```

| Attribute | Default | Values             |
| --------- | ------- | ------------------ |
| `shadow`  | `0`     | `0`, `1`, `2`, `3` |

### ContextMenu - `ui-context-menu`

Wrap any element to add a right click context menu.

```html
<ui-context-menu>
  <div>Right Click Here</div>
  <ui-menu slot="menu">
    <ui-menu-item>Option 1</ui-menu-item>
  </ui-menu>
</ui-context-menu>
```

| Attribute   | Default        | Values                               |
| ----------- | -------------- | ------------------------------------ |
| `placement` | `bottom-start` | [Popper Placement][popper-placement] |

### Dropdown - `ui-dropdown`

This works the same as `ui-picker` but will display a caret on button elements that flips based on `placement`.

```html
<ui-dropdown>
  <ui-button>Down</ui-button>
  <ui-menu slot="menu">
    <ui-menu-item>Option 1</ui-menu-item>
  </ui-menu>
</ui-dropdown>
```

| Attribute   | Default        | Values                               |
| ----------- | -------------- | ------------------------------------ |
| `placement` | `bottom-start` | [Popper Placement][popper-placement] |

> Note: The `menu` slot can be any element, but the most common will be `ui-menu`.

### Flex - `ui-flex`

Flex layout helper tags.

```html
<ui-flex>
  <ui-flex flex="1">Column 1 (flex=1)</ui-flex>
  <ui-flex flex="2">Column 2 (flex=2)</ui-flex>
  <ui-flex>Column 3 (flex=content)</ui-flex>
</ui-flex>
```

| Attribute   | Default        | Values                               |
| ----------- | -------------- | ------------------------------------ |
| `flex` | `content` | Usually an integer |
| `column` | | `flex-direction: column` |
| `row` | | `flex-direction: row` |

### Form - `ui-form`

The form shold wrap any elements you plan to use. It will handle simple things like validation.

```html
<ui-form oninit={handleFormInit} onsubmit={handleFormSubmit} onchange={handleFormChange}>
  <ui-label>
    Type Textarea
    <ui-input type="textarea" value={value}></ui-textarea>
  </ui-label>
  <ui-button submit>Submit Form</button>
</ui-form>
```

| Component         | ui-input type=\* | Attributes                           |
| ----------------- | ---------------- | ------------------------------------ |
| ui-input-text     | text             | value, minlength, maxlength, pattern |
| ui-input-counter  | counter          | value, step, min, max                |
| ui-textarea       | textarea         | value, minlength, maxlength, pattern |
| ui-input-number   | number           | value, min, max, step                |
| ui-input-password | password         | value, minlength                     |
| ui-input-syntax   | syntax           | value, parts                         |

### Input Syntax

This is a text input with auto complete.

```ts
@track
```

### Icon - `ui-icon`

Use with the `@mdi/js` package which contains thousands of icons.

```typescript
import { mdiAccount } from '@mdi/js';
// ...
@track mdiAccount: string = mdiAccount;
```

```html
<ui-icon path={mdiAccount}></ui-icon>
```

### List - `ui-list`

List is often used with the `ui-card` component.

```html
<ui-list>
  <ui-list-header>Items</ui-list-header>
  <ui-list-item>Item 1</ui-list-item>
  <ui-list-separator></ui-list-separator>
  <ui-list-section>
    <ui-list-header>Additional Items</ui-list-header>
    <ui-list-item>
      <ui-icon slot="left" path={mdiNumeric1}></ui-icon>
      Item 2
    </ui-list-item>
  </ui-list-section>
</ui-list>
```

### Menu - `ui-menu`

The menu can be used by itself or with `ui-context-menu`, `ui-dropdown`, and `ui-picker`.

```html
<ui-menu>
  <ui-menu-item>Option 1</ui-menu-item>
  <ui-menu-separator></ui-menu-separator>
  <ui-menu-item>Option 2</ui-menu-item>
  <ui-menu-item>Option 3</ui-menu-item>
</ui-menu>
```

### Modal - `ui-modal`

```html
<ui-modal>
  <ui-modal-header>Title</ui-modal-header>
  <ui-modal-body>Content</ui-modal-body>
  <ui-modal-footer>
    <ui-button>Button</ui-button>
  </ui-modal-footer>
</ui-modal>
```

### Picker - `ui-picker`

Exact same as `ui-dropdown`, but does not cause a inner `ui-button` to render a caret. Think date picker dropdown.

```html
<ui-dropdown>
  <ui-button>Down</ui-button>
  <div slot="menu">
    This can be absolutely anything.
  </div>
</ui-dropdown>
```

| Attribute   | Default        | Values                               |
| ----------- | -------------- | ------------------------------------ |
| `placement` | `bottom-start` | [Popper Placement][popper-placement] |

### Tab - `ui-tab`

The `ui-tab` creates tabs using the existing `ui-nav` and `ui-nav-item` elements.

```html
<ui-tab>
  <ui-nav>
    <ui-nav-item>
      Basic Tab 1
    </ui-nav-item>
    <ui-nav-item>
      Basic Tab 2
    </ui-nav-item>
  </ui-nav>
  <ui-tab-item>
    Basic Tab 1 content
  </ui-tab-item>
  <ui-tab-item>
    Basic Tab 2 content
  </ui-tab-item>
</ui-tab>
```

### Toast - `ui-toast`

To use the toast service you must include one `ui-toast` component in the root of your app.

```html
<ui-toast></ui-toast>
```

```typescript
import {
  showToast,
  showWarningToast,
  showErrorToast,
  showLoadingToast,
  removeToast,
  removeAllToasts
} from `lwc-ui`;
// ...
var id = showToast('Saved');
showWarningToast('Ehh... could be worse', 3);
showErrorToast('No good.', 3);
showLoadingToast('Soon...', 3);
// Remove a specific toast
removeToast(id);
// Or remove all toasts
removeAllToasts();
```

### Tree - `ui-tree`

```html
<ui-tree folder={isFolder}>
  <ui-tree-item>
    Item 1
    <ui-tree-item-group>
      <ui-tree-item>
        Sub Item 1
      </ui-tree-item>
      <ui-tree-item>
        <ui-icon path={mdiFile}></ui-icon>
        Sub Item 2
      </ui-tree-item>
    </ui-tree-item-group>
  </ui-tree-item>
</ui-tree>
```

| Attribute | Default   | Values                         |
| --------- | --------- | ------------------------------ |
| `variant` | `default` | `default`, `chevron`, `folder` |

## Why?

Mostly using this to try out ideas in TypeScript.

[popper-placement]: https://popper.js.org/popper-documentation.html#Popper.placements
