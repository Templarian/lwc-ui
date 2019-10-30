import { LightningElement, api, track } from 'lwc';

export default class TreeItemText extends LightningElement {
  @api value = '';

  @track isEditing = false;

  get inputElement(): HTMLInputElement {
    return this.template.querySelector('input');
  }

  _previousValue = '';
  handleRename() {
    this.isEditing = true;
    this._previousValue = this.value;
    requestAnimationFrame(() => {
      this.inputElement.focus();
    });
  }

  handleBlur(e: any) {
    if (this.isEditing) {
      this.value = e.target.value;
      this.isEditing = false;
    }
  }

  handleMouseDown(e: MouseEvent) {
    if (e.detail === 2) {
      this.isEditing = true;
      this._previousValue = this.value;
      requestAnimationFrame(() => {
        this.inputElement.focus();
        const length = this.inputElement.value.length;
        this.inputElement.setSelectionRange(0, length);
      });
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.which === 13) {
      this.handleBlur(e);
    }
    if (e.which === 27) {
      this.isEditing = false;

      console.log(this._previousValue, '--', this.value);
      this.value = this._previousValue;
    }
  }
}
