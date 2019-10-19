import { LightningElement, api } from 'lwc';
import { match } from 'minimatch';

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
            this._values.push(match[1]);
            return;
          }
        });
      } else if (typeof values === 'string') {
        const regexMatch = values.match(/\/([^\/]+)\//);
        if (regexMatch) {
          // Regex Pattern
          const regex = new RegExp(`^(${regexMatch[1]})${this.separator}?`);
          const match = iterateValue.match(regex);
          if (match) {
            iterateValue = iterateValue.replace(regex, '');
            console.log('matched -', match[1], '-', iterateValue);
            this._values.push(match[1]);
            return;
          }
        } else {
          // No idea
        }
      }
      // Invalid Part Value
      if (this._values.length !== i + 1) {
        this._values.push('?');
      }
    });
  }

  get valuesList() {
    const list = [];
    let id = 0;
    this._values.forEach((value, i) => {
      list.push({
        id: id++,
        value: value,
        computedClass: 'property'
      });
      if (this._values.length > i) {
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

  handleFocus() {
    (this.template.childNodes[3] as HTMLElement).classList.add('focus');
  }

  handleBlur() {
    (this.template.childNodes[3] as HTMLElement).classList.remove('focus');
  }

  handleChange(e: InputEvent) {
    const newValue = (e.target as HTMLTextAreaElement).value;
    if (this.value !== newValue) {
      this.value = (e.target as HTMLTextAreaElement).value;
      this.dispatchEvent(
        new CustomEvent('form_change', {
          bubbles: true,
          detail: {
            name: this.name,
            value: this.value,
            valid: true
          }
        })
      );
    }
  }
}
