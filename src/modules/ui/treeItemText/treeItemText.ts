import { LightningElement, api, track } from 'lwc';

export default class TreeItemText extends LightningElement {
  @api value = '';

  @track isEditing = false;

  get inputElement(): HTMLInputElement {
    return this.template.querySelector('input');
  }

  handleRename() {
    this.isEditing = true;
    requestAnimationFrame(() => {
      this.inputElement.focus();
    });
  }

  handleBlur(e) {
    this.isEditing = false;
    this.value = e.target.value;
  }

  handleMouseDown(e: MouseEvent) {
    if (e.detail === 2) {
      this.isEditing = true;
      requestAnimationFrame(() => {
        this.inputElement.focus();
        const length = this.inputElement.value.length;
        this.inputElement.setSelectionRange(0, length);
      });
    }
  }
}