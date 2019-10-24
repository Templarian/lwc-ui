import { LightningElement, api, track } from 'lwc';

export default class TreeItemText extends LightningElement {
    @api value = '';

    @track isEditing = false;

    get inputElement() {
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
}