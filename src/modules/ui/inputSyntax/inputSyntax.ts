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
          hasNull,
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
    return this.values instanceof Array && this._showList;
  }

  get hasDescription() {
    return !(this.values instanceof Array || this.values === null) && this._showList;
  }

  _mouseFocus = false;
  handleMouseDown(e: MouseEvent) {
    this._mouseFocus = true;
    const input = (this.template.childNodes[1] as HTMLInputElement);
    requestAnimationFrame(() => {
      this._filter = '';
      this._caret = input.selectionStart;
      this.updatePart();
    });
    if (e.detail === 2) {
      this.selectPart(this._part);
      e.preventDefault();
    } else if (e.detail === 2) {
      input.setSelectionRange(0, this._value.length);
      e.preventDefault();
    }
  }

  updatePart() {
    // Calculate Part
    let startColumn = 0;
    let endColumn = 0;
    const prevPart = this._part;
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
    if (this.values) {
      this._showList = true;
    }
    if (prevPart !== this._part) {
      this._filter = null;
    }
  }

  handleFocus(e: FocusEvent) {
    console.log('focus')
    const input = (this.template.childNodes[1] as HTMLInputElement);
    input.classList.add('focus');
    (this.template.childNodes[3] as HTMLElement).classList.add('focus');
    const self = this;
    function keyUp(e: KeyboardEvent) {
      const { which, shiftKey} = e;
      if (which === 9) {
        if (shiftKey) {
          const index = self._values.findIndex(x => !x.valid);
          const part = index === -1 ? self._values.length - 1 : index;
          const offsetPart = [...self._values].reverse().findIndex(x => !x.hasNull);
          self.selectPart(part - offsetPart);
        } else {
          self.selectPart(0);
        }
      }
      input.removeEventListener('keyup', keyUp);
    }
    if (!this._mouseFocus) {
      input.addEventListener('keyup', keyUp);
    }
    this._mouseFocus = false;
    input.setSelectionRange(0, 0);
  }

  handleBlur() {
    (this.template.childNodes[1] as HTMLElement).classList.remove('focus');
    (this.template.childNodes[3] as HTMLElement).classList.remove('focus');
    if (!this._menuFocus) {
      this._showList = false;
    }
    this.offsetOverlay(0);
  }

  handleScroll(e: MouseWheelEvent) {
    this.offsetOverlay();
  }

  offsetOverlay(x: number = null) {
    const input = this.template.childNodes[1] as HTMLInputElement;
    const valuesEle = (this.template.childNodes[3] as HTMLElement);
    const ele = valuesEle.childNodes[0] as HTMLDivElement;
    x = x === null ? input.scrollLeft : x;
    ele.style.left = `-${x * window.devicePixelRatio}px`;
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.which) {
      case 38:
        this.focusPrevious();
        e.preventDefault();
        return;
      case 40:
        this.focusNext();
        e.preventDefault();
        return;
      case 13:
        this.select(this.list[this._selected].value);
        e.preventDefault();
        return;
      case 16:
        return;
      case 9:
        if (e.shiftKey) {
          this.shiftTab(e);
        } else {
          this.tab(e);
        }
        return;
    }
    const input = (this.template.childNodes[1] as HTMLInputElement);
    requestAnimationFrame(() => {
      this._caret = input.selectionStart;
      this.updatePart();
    });
  }

  focusPrevious() {
    if (!this._showList) {
      return;
    }
    if (this._selected != 0) {
      this._selected -= 1;
    }
    this._showList = true;
  }

  focusNext() {
    if (!this._showList) {
      console.log(this._values, this._part)
      return;
    }
    if (this._selected !== this.list.length - 1) {
      this._selected += 1;
    }
    this._showList = true;
  }

  tab(e: KeyboardEvent) {
    this._showList = false;
    const values = this._values;
    const item = values[this._part];
    if (item.valid) {
      const next = values[this._part + 1];
      if (next && !next.hasNull) {
        this.selectPart(this._part + 1);
        const { startColumn } = this.getColumns(this._part);
        if (this._value.length < startColumn) {
          this._value = `${this._value}${this.separator}`;
        }
        e.preventDefault();
      }
    }
  }

  shiftTab(e: KeyboardEvent) {
    this._showList = false;
    if (this._part !== 0) {
      this.selectPart(this._part - 1);
      e.preventDefault();
    }
  }

  selectPart(part: number) {
    const input = (this.template.childNodes[1] as HTMLInputElement);
    const { startColumn, endColumn } = this.getColumns(part);
    input.setSelectionRange(startColumn, endColumn);
    this._caret = startColumn;
    this.updatePart();
    this._showList = true;
    console.log('show list')
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
    if (!this._showList) {
      return;
    }
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
    this._showList = false;
    if (nextRequired) {
      requestAnimationFrame(() => {
        this._caret = valueEndColumn;
        input.focus();
        this.selectPart(this._part + 1);
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
    requestAnimationFrame(() => {
      this.offsetOverlay();
      this._filter = this._values[this._part].value;
      this._selected = 0;
      this._menuFocus = false;
    })
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
