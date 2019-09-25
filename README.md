# lwc-ui

Minimal UI Components for Prototypes.

## Components

### Button - `ui-button`

```html
<ui-button>
  <ui-icon slot="left" path={mdiAccount}></ui-icon>
  Account Button
</ui-button>
```

### ButtonGroup - `ui-button-group`

```html
<ui-button-group>
  <ui-button>Button 1</ui-button>
  <ui-button>Button 2</ui-button>
</ui-button-group>
```

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

### Dropdown - `ui-dropdown`

This works the same as `ui-picker` but will flip

```html
<ui-dropdown>
  <ui-button>Down</ui-button>
  <ui-menu slot="menu">
      <ui-menu-item>Option 1</ui-menu-item>
  </ui-menu>
</ui-dropdown>
```

> Note: The `menu` slot can be any element, but the most common will be `ui-menu`.

### Form - `ui-form`

The form shold wrap any elements you plan to use. It will handle simple things like validation.

```html
<ui-form>
  <ui-label>
    Type Textarea
    <ui-input type="textarea" value={value}></ui-textarea>
  </ui-label>
  <ui-button submit>Submit Form</button>
</ui-form>
```

| Component          | ui-input type=* | Attributes |
|--------------------|-----------|----------------------|
| ui-input-text      | text      | minlength, maxlength |
| ui-textarea        | textarea  | minlength, maxlength |
| ui-input-number    | number    | min, max, step |
| ui-input-passwrod  | password  | minlength |

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