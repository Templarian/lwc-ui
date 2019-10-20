import { LightningElement, api } from 'lwc';

export default class InputSyntax extends LightningElement {
  // Note: I'll clean up this code eventually, very ugly
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
    return value.replace(/([\\\/\(\)\.\[\]])/g, "\\$1");
  }

  updateValues() {
    let iterateValue = this._value;
    let valid = true;
    let hasNull = false;
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
      } else if (values === null) {
        hasNull = true;
      }
      // Invalid Part Value
      if (this._values.length !== i + 1 && valid) {
        this._values.push({
          hasNull: true,
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
        console.log(this.name, ' - ', this._values[i + 1].value)
        if (!this._values[i + 1].hasNull && this._values[i + 1].value !== null) {
          list.push({
            id: id++,
            value: this.separator,
            computedClass: 'separator'
          });
        }
      }
    });
    return list;
  }

  get partName() {
    return this._parts[this._part].name;
  }

  _selected = 0;
  get list() {
    const list = this._filter
      ? this.values.filter((item: string) => {
          return item.toLowerCase().includes(this._filter.toLowerCase())
        })
      : this.values;
    return list.map((item: string, i) => {
        return {
          id: i,
          value: item,
          computedClass: i === this._selected ? 'select' : ''
        };
    });
  }

  get values() {
    return this.getValues();
  }

  getValues(offset: number = 0) {
    if (this._parts.length <= this._part + offset) {
      return null;
    }
    const values = this._parts[this._part + offset].values;
    return values instanceof Array ? [...values] : values(this._values);
  }

  _showList = false;
  get hasPartList() {
    return this.values instanceof Array && (this._showList || this._menuFocus);
  }

  get hasDescription() {
    return !(this.values instanceof Array || this.values === null) && (this._showList || this._menuFocus);
  }

  handleMouseDown() {
    const input = (this.template.childNodes[1] as HTMLInputElement);
    requestAnimationFrame(() => {
      this._filter = '';
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
    (this.template.childNodes[1] as HTMLElement).classList.remove('focus');
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
    if (e.which === 13) {
      this.select(this.list[this._selected].value);
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
    if (this._selected != 0) {
      this._selected -= 1;
    }
  }

  focusNext() {
    if (this._selected !== this.list.length - 1) {
      this._selected += 1;
    }
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
      startColumn = endColumn + this.separator.length;
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
    const { value } = target.dataset;
    this.select(value);
  }

  select(value) {
    const input = (this.template.childNodes[1] as HTMLInputElement);
    const { startColumn, endColumn } = this.getColumns(this._part);
    this._value = this.spliceSlice(this._value, startColumn, endColumn, value);
    let valueEndColumn = startColumn + value.length;
    const createSeperator = this._value.slice(valueEndColumn) === ''
      && this._part !== this.parts.length - 1;
    this.updateValues();
    const nextRequired = this.getValues(1) !== null;
    if (createSeperator && nextRequired) {
      this._value = this.spliceSlice(this._value, valueEndColumn, valueEndColumn, this.separator);
      valueEndColumn += 1;
    } else if (!nextRequired) {
      this._value = this._value.slice(0, valueEndColumn);
    }
    this.updateValues();
    this._menuFocus = false;
    this._filter = '';
    if (createSeperator && nextRequired) {
      requestAnimationFrame(() => {
        this._caret = valueEndColumn;
        input.setSelectionRange(valueEndColumn, valueEndColumn);
        input.focus();
        this.updatePart();
        this._selected = 0;
      });
    }
  }

  _menuFocus = false;
  handleMenuMouseEnter() {
    this._menuFocus = true;
  }

  handleMenuMouseLeave() {
    this._menuFocus = false;
  }

  _filter = null;
  handleInput(e: InputEvent) {
    this.handleChange(e);
    this.updateValues();
    this._filter = this._values[this._part].value;
    this._selected = 0;
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
