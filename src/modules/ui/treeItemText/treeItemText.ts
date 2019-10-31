import { LightningElement, api, track } from 'lwc';
import {
  mdiDelete,
  mdiPencil,
  mdiFolderPlus,
  mdiFilePlus,
  mdiDotsHorizontal
} from '@mdi/js';
import { dispatchParent } from 'ui/util';

interface ParentFileTreeEvent {
  action: string;
  type?: string;
}

export default class TreeItemText extends LightningElement {
  @api value = '';

  @track isEditing = false;
  mdiDelete: string = mdiDelete;
  mdiPencil: string = mdiPencil;
  mdiFolderPlus: string = mdiFolderPlus;
  mdiFilePlus: string = mdiFilePlus;
  mdiDotsHorizontal: string = mdiDotsHorizontal

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
      this.edit();
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.which === 13) {
      this.handleBlur(e);
    }
    if (e.which === 27) {
      this.isEditing = false;
      this.value = this._previousValue;
    }
  }

  handleNewGroup() {
    dispatchParent<ParentFileTreeEvent>(this, {
      action: 'new',
      type: 'folder'
    });
  }

  handleNewNode() {
    dispatchParent<ParentFileTreeEvent>(this, {
      action: 'new',
      type: 'file'
    });
  }

  handleRemove() {
    dispatchParent<ParentFileTreeEvent>(this, {
      action: 'remove'
    });
  }

  handleEdit(e: MouseEvent) {
    e.stopPropagation();
    this.edit();
  }

  edit() {
    this.isEditing = true;
    this._previousValue = this.value;
    requestAnimationFrame(() => {
      this.inputElement.focus();
      const length = this.inputElement.value.length;
      this.inputElement.setSelectionRange(0, length);
    });
  }
}
