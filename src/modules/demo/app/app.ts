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
  mdiInformation,
  mdiClose,
  mdiPlus,
  mdiWorker,
  mdiCalendar
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
  @track mdiClose: string = mdiClose;
  @track mdiPlus: string = mdiPlus;
  @track mdiCalendar: string = mdiCalendar;

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

  // Tab
  tabUniqueId = 3;
  @track tabItems = [
    {
      id: 1,
      label: 'Tab 1',
      icon: mdiAccount,
      content: 'Tab Content 1'
    },
    {
      id: 2,
      label: 'Tab 2',
      icon: mdiWorker,
      content: 'Tab Content 2'
    }
  ];

  addTab() {
    const id = this.tabUniqueId++;
    this.tabItems.push({
      id,
      label: `Tab ${id}`,
      icon: mdiAccount,
      content: `Tab Content ${id}`
    });
  }

  removeTab(e: MouseEvent) {
    const target = e.target as HTMLElement;
    console.log('id:', target.dataset.id);
    const id = parseInt(target.dataset.id as string, 10);
    const index = this.tabItems.findIndex(t => t.id === id);
    this.tabItems.splice(index, 1);
    e.stopPropagation();
  }

  // Input Syntax
  @track parts = [
    {
      name: 'Resource',
      color: 'blue',
      values: [
        'Player.health',
        'Player.mana',
        'Player.strength',
        'Player.experience',
        'Player.level',
        'Player.constitution',
        'Player.dexterity',
        'Player.intelligence',
        'Player.wisdom',
        'Player.charisma',
        'Quests.rats.state.completed',
        'Quests.rats.state.done',
        'Quests.rats.state.count',
        'Player.inventory[arrow.wood]',
        'Player.inventory[arrow.copper]',
        'Player.inventory[arrow.silver]',
        'Player.inventory[arrow.glass]',
        'Player.inventory[gold]'
      ]
    },
    {
      name: 'Operator',
      color: '#222',
      values: [
        'Set',
        'Not Set',
        'Equal To',
        'Not Equal To',
        'Less Than',
        'Less Than Or Equal',
        'Greater Than',
        'Greater Than Or Equal'
      ]
    },
    {
      name: 'Value',
      color: '#222',
      values: function(parts) {
        switch (parts[1].value) {
          case 'Set':
          case 'Not Set':
            return null;
          case 'Less Than':
          case 'Less Than Or Equal':
          case 'Greater Than':
          case 'Greater Than Or Equal':
            return '/[0-9]+/';
          case 'Equal To':
          case 'Not Equal To':
            return '';
          default:
            return null;
        }
      }
    }
  ];

  @track folders = [
    {
      name: 'Folder',
      color: 'blue',
      values: [
        'Home'
      ]
    },
    {
      name: 'Folder',
      color: '#222',
      values: [
        'Folder 1',
        'Folder 2'
      ]
    },
    {
      name: 'Folder',
      color: '#222',
      values: function(parts) {
        switch (parts[1].value) {
          case 'Folder 1':
            return [
              'Subfolder 1',
              'Subfolder 2',
              'foo.txt'
            ];
          case 'Folder 2':
            return [
              'Subfolder A',
              'Subfolder B',
              'bar.txt'
            ];
        }
      }
    }
  ];
}
