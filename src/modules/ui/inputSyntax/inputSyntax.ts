import { LightningElement, api } from 'lwc';

export default class InputSyntax extends LightningElement {
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

  updateValues() {
    let iterateValue = this._value;
    this._values = [];
    this._parts.forEach((part, i) => {
      const values =
        part.values instanceof Array ? part.values : part.values(this._values);
      if (values instanceof Array) {
        values.forEach(partValue => {
          const regex = new RegExp(`^(${partValue})${this.separator}?`);
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
      }
      // Invalid Part Value
      if (this._values.length !== i + 1) {
        this._values.push({
          valid: false,
          value: iterateValue
        });
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

  get hasPartList() {
    return this._parts[this._part].values instanceof Array;
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
    (this.template.childNodes[3] as HTMLElement).classList.add('focus');
  }

  handleBlur() {
    (this.template.childNodes[3] as HTMLElement).classList.remove('focus');
  }

  handleKeyDown(e: InputEvent) {
    const input = (this.template.childNodes[1] as HTMLInputElement);
    requestAnimationFrame(() => {
      this._caret = input.selectionStart;
      this.updatePart();
    });
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
