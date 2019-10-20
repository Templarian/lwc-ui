import { LightningElement, api } from 'lwc';

export default class InputSyntax extends LightningElement {
  // Note this is just a very messy prototype
  _value = '';
  @api
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.updateValues();
  }

  @api name = '';
  @api separator = ' ';
  _values = [];
  _parts = [];
  _part = 0;
  _caret = 0;
  @api
  get parts() {
    return this._parts;
  }
  set parts(value) {
    this._parts = value;
    this.updateValues();
  }

  regexSafe(value) {
    return value.replace(/([\(\)\.\[\]])/g, "\\$1");
  }

  updateValues() {
    let iterateValue = this._value;
    let valid = true;
    this._values = [];
    this._parts.forEach((part, i) => {
      if (!valid) {
        this._values.push({
          valid: false,
          value: null
        });
        return;
      }
      const values =
        part.values instanceof Array ? [...part.values] : part.values(this._values);
      if (values instanceof Array) {
        let found = false;
        values.sort((a, b) => {
          return b.length - a.length;
        }).forEach(partValue => {
          const escapedPartValue = this.regexSafe(partValue);
          const last = this._parts.length === i + 1 ? '$' : `(${this.separator})?`;
          const regex = new RegExp(`^(${escapedPartValue})${last}`);
          const match = iterateValue.match(regex);
          if (!found && match) {
            iterateValue = iterateValue.replace(regex, '');
            console.log('matched -', match[1], '-', iterateValue);
            this._values.push({
              valid: true,
              value: match[1]
            });
            found = true;
          }
        });
        if (!found) {
          this._values.push({
            valid: false,
            value: iterateValue
          });
          valid = false;
        }
      } else if (typeof values === 'string' && values === '') {
        // Allow Any Value
        this._values.push({
          valid: true,
          value: iterateValue
        });
      } else if (typeof values === 'string') {
        const regexMatch = values.match(/\/([^\/]+)\//);
        if (regexMatch) {
          // Regex Pattern
          const last = this._parts.length === i + 1 ? '$' : `(${this.separator})?`;
          const regex = new RegExp(`^(${regexMatch[1]})${last}`);
          const match = iterateValue.match(regex);
          if (match) {
            iterateValue = iterateValue.replace(regex, '');
            console.log('matched -', match[1], '-', iterateValue);
            this._values.push({
              valid: true,
              value: match[1]
            });
            return;
          }
        } else {
          // No idea
        }
      } else {
        /*this._values.push({
          valid: false,
          value: iterateValue
        });
        valid = false;
        return;*/
      }
      // Invalid Part Value
      if (this._values.length !== i + 1 && valid) {
        this._values.push({
          valid: false,
          value: iterateValue
        });
        valid = false;
      }
    });
  }

  get valuesList() {
    const separators = this._values.length - 1;
    const list = [];
    let id = 0;
    this._values.forEach((item, i) => {
      list.push({
        id: id++,
        value: item.value,
        computedClass: item.valid ? 'property' : 'property-invalid'
      });
      if (separators > i) {
        list.push({
          id: id++,
          value: this.separator,
          computedClass: 'separator'
        });
      }
    });
    return list;
  }

  get partName() {
    return this._parts[this._part].name;
  }

  get list() {
    return this._parts[this._part].values;
  }

  _showList = false;
  get hasPartList() {
    return this._parts[this._part].values instanceof Array && (this._showList || this._menuFocus);
  }

  get hasDescription() {
    return !(this._parts[this._part].values instanceof Array) && (this._showList || this._menuFocus);
  }

  handleMouseDown() {
    const input = (this.template.childNodes[1] as HTMLInputElement);
    requestAnimationFrame(() => {
      this._caret = input.selectionStart;
      this.updatePart();
    });
  }

  updatePart() {
    // Calculate Part
    let startColumn = 0;
    let endColumn = 0;
    this._part = 0;
    let i = 0;
    for(let item of this._values) {
      if (item.valid) {
        endColumn = startColumn + item.value.length;
        console.log(i, this._caret, startColumn, endColumn)
        if (this._caret >= startColumn && this._caret <= endColumn) {
          this._part = i;
          break;
        }
        startColumn = endColumn + this.separator.length;
      }
      i += 1;
    };
    if (this._caret > endColumn) {
      this._part = this._values.reduce((p, c, i) => c.valid ? i + 1 : p, 0);
      console.log('assuming', this._part);
    }
  }

  handleFocus() {
    (this.template.childNodes[1] as HTMLElement).classList.add('focus');
    (this.template.childNodes[3] as HTMLElement).classList.add('focus');
    this._showList = true;
  }

  handleBlur() {
    (this.template.childNodes[3] as HTMLElement).classList.remove('focus');
    this._showList = false;
  }

  handleKeyDown(e: InputEvent) {
    if (e.which === 38) {
      this.focusPrevious();
      e.preventDefault();
      return;
    }
    if (e.which === 40) {
      this.focusNext();
      e.preventDefault();
      return;
    }
    const input = (this.template.childNodes[1] as HTMLInputElement);
    requestAnimationFrame(() => {
      this._caret = input.selectionStart;
      this.updatePart();
    });
  }

  focusPrevious() {

  }

  focusNext() {

  }

  getColumns(part) {
    let startColumn = 0;
    let endColumn = 0;
    let i = 0;
    for(let item of this._values) {
      if (item.value === null) {
        break;
      }
      endColumn = startColumn + item.value.length;
      if (i === part) {
        break;
      }
      startColumn += endColumn + this.separator.length;
      i++;
    }
    return {
      startColumn,
      endColumn
    }
  }

  spliceSlice(str, startColumn, endColumn, add) {
    return `${str.slice(0, startColumn)}${add || ''}${str.slice(endColumn)}`;
  }

  handleSelect(e: Event) {
    const target = e.target as HTMLElement;
    const input = (this.template.childNodes[1] as HTMLInputElement);
    const { startColumn, endColumn } = this.getColumns(this._part);
    const { value } = target.dataset;
    this._value = this.spliceSlice(this._value, startColumn, endColumn, value);
    let valueEndColumn = startColumn + value.length;
    const space = this._value.slice(valueEndColumn);
    if (space === '') {
      this._value = this.spliceSlice(this._value, valueEndColumn, valueEndColumn, ' ');
      valueEndColumn += 1;
    }
    this.updateValues();
    this._menuFocus = false;
    requestAnimationFrame(() => {
      this._caret = valueEndColumn;
      input.setSelectionRange(valueEndColumn, valueEndColumn);
      input.focus();
      this.updatePart();
    });
  }

  _menuFocus = false;
  handleMenuMouseEnter() {
    this._menuFocus = true;
  }

  handleMenuMouseLeave() {
    this._menuFocus = false;
  }

  handleInput(e: InputEvent) {
    this.handleChange(e);
    this.updateValues();
  }

  handleChange(e: InputEvent) {
    const newValue = (e.target as HTMLInputElement).value;
    if (this._value !== newValue) {
      this._value = newValue;
      this.dispatchEvent(
        new CustomEvent('form_change', {
          bubbles: true,
          detail: {
            name: this.name,
            value: this._value,
            valid: true
          }
        })
      );
    }
  }
}
