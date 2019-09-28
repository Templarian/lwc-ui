import { LightningElement, track } from 'lwc';
import { toast, errorToast, warningToast, loadingToast, removeToast } from 'services/toastService';
import {
    mdiAccount,
    mdiFormatAlignLeft,
    mdiFormatAlignCenter,
    mdiFormatAlignRight
} from '@mdi/js';

export default class App extends LightningElement {

    @track mdiAccount: string = mdiAccount;
    @track mdiFormatAlignLeft: string = mdiFormatAlignLeft;
    @track mdiFormatAlignCenter: string = mdiFormatAlignCenter;
    @track mdiFormatAlignRight: string = mdiFormatAlignRight;

    handleToast() {
        toast('Testing 3 Seconds', 3);
    }

    @track loadingToastId: number = 0;
    handleToastLoading() {
        this.loadingToastId = loadingToast('Loading Stuff...');
        console.log(`Toast Opened: ${this.loadingToastId}`);
    }

    handleToastClose() {
        removeToast(this.loadingToastId);
        console.log(`Toast Removed: ${this.loadingToastId}`);
        this.loadingToastId = 0;
    }

    handleToastWarning() {
        warningToast('Testing 4 Seconds', 4);
    }

    handleToastError() {
        errorToast('Testing 5 Seconds', 5);
    }

    @track shadow: string = '0';
    setShadowHandler(e: Event) {
        const target = e.target as HTMLElement;
        this.shadow = target.dataset.shadow as string;
    }

}
