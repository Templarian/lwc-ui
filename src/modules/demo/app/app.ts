import { LightningElement } from 'lwc';
import { toast } from 'services/toastService';

export default class App extends LightningElement {

    handleToast() {
        toast('Testing 3 Seconds', 3);
    }
}
