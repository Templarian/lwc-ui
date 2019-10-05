import { LightningElement, track } from 'lwc';
import {
  showToast,
  showErrorToast,
  showWarningToast,
  showLoadingToast,
  removeToast
} from 'ui/toastService';
import {
  mdiAccount,
  mdiAccountBox,
  mdiFormatAlignLeft,
  mdiFormatAlignCenter,
  mdiFormatAlignRight,
  mdiPackageVariant,
  mdiPackageVariantClosed,
  mdiGithubCircle,
  mdiAlert,
  mdiAlertOctagon,
  mdiCheckCircle,
  mdiInformation
} from '@mdi/js';
import { FormEvent } from 'ui/form';

export default class App extends LightningElement {
  @track mdiAccount: string = mdiAccount;
  @track mdiAccountBox: string = mdiAccountBox;
  @track mdiFormatAlignLeft: string = mdiFormatAlignLeft;
  @track mdiFormatAlignCenter: string = mdiFormatAlignCenter;
  @track mdiFormatAlignRight: string = mdiFormatAlignRight;
  @track mdiPackageVariant: string = mdiPackageVariant;
  @track mdiPackageVariantClosed: string = mdiPackageVariantClosed;
  @track mdiGithubCircle: string = mdiGithubCircle;
  @track mdiAlert: string = mdiAlert;
  @track mdiAlertOctagon: string = mdiAlertOctagon;
  @track mdiCheckCircle: string = mdiCheckCircle;
  @track mdiInformation: string = mdiInformation;

  handleToast() {
    showToast('Testing 3 Seconds', 3);
  }

  @track loadingToastId: number = 0;
  handleToastLoading() {
    this.loadingToastId = showLoadingToast('Loading Stuff...');
    console.log(`Toast Opened: ${this.loadingToastId}`);
  }

  handleToastClose() {
    removeToast(this.loadingToastId);
    console.log(`Toast Removed: ${this.loadingToastId}`);
    this.loadingToastId = 0;
  }

  handleToastWarning() {
    showWarningToast('Testing 4 Seconds', 4);
  }

  handleToastError() {
    showErrorToast('Testing 5 Seconds', 5);
  }

  @track shadow: string = '0';
  setShadowHandler(e: Event) {
    const target = e.target as HTMLElement;
    this.shadow = target.dataset.shadow as string;
  }

  @track isModalOpen: boolean = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSelect({ target }: Event) {
    var range = document.createRange();
    range.selectNode(target as HTMLElement);
    const selection = window.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Form
  @track formInitValue: string = '';
  @track formChangeValue: string = '';
  @track formSubmitValue: string = '';

  handleFormInit(e: FormEvent) {
    this.formInitValue = JSON.stringify(e.detail);
  }

  handleFormChange(e: FormEvent) {
    this.formChangeValue = JSON.stringify(e.detail);
  }

  handleFormSubmit(e: FormEvent) {
    this.formSubmitValue = JSON.stringify(e.detail);
  }
}