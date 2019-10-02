import { register, ValueChangedEvent } from '@lwc/wire-service';
import { getSubject } from './util';
import { Toast } from 'ui/models';

const toasts: Toast[] = [];
const subject = getSubject([], undefined);

export function getObservable() {
  return subject.observable;
}

let uniqueId = 0;

function pushToast(toast: Toast) {
  toast.id = ++uniqueId;
  toasts.push(toast);
  subject.next(toasts);
  if (toast.seconds) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.seconds * 1000);
  }
  return toast.id;
}

export function showToast(message: string, seconds = 0) {
  var toast = new Toast();
  toast.message = message;
  toast.seconds = seconds;
  return pushToast(toast);
}

export function showErrorToast(message: string, seconds = 0) {
  var toast = new Toast();
  toast.message = message;
  toast.seconds = seconds;
  toast.variant = 'error';
  return pushToast(toast);
}

export function showWarningToast(message: string, seconds = 0) {
  var toast = new Toast();
  toast.message = message;
  toast.seconds = seconds;
  toast.variant = 'warning';
  return pushToast(toast);
}

export function showLoadingToast(message: string, seconds = 0) {
  var toast = new Toast();
  toast.message = message;
  toast.seconds = seconds;
  toast.variant = 'loading';
  toast.dismissable = false;
  return pushToast(toast);
}

export function removeToast(id: number) {
  toasts.splice(toasts.findIndex(x => x.id === id), 1);
  subject.next(toasts);
}

export function removeAllToasts() {
  toasts.forEach(toast => {
    removeToast(toast.id);
  })
}

export function getToasts() {
  return new Promise((resolve, reject) => {
    const observable = getObservable();
    if (!observable) {
      reject(new Error('Dev: invalid observable'));
    }

    observable.subscribe({
      next: (value: any) => resolve(value),
      error: (error: any) => reject(error),
      complete: resolve,
    });
  });
}

register(getToasts, function getMapWireAdapter(wiredEventTarget) {
  let subscription: any;

  wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error: undefined }));

  const observer = {
    next: (data: any) =>
      wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data, error: undefined })),
    error: (error: any) =>
      wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error }))
  };

  wiredEventTarget.addEventListener('connect', () => {
    const observable = getObservable();
    if (observable) {
      subscription = observable.subscribe(observer);
    }
  });

  wiredEventTarget.addEventListener('disconnect', () => {
    subscription.unsubscribe();
  });

  wiredEventTarget.addEventListener('config', () => {
    // config = newConfig;
    if (subscription) {
      subscription.unsubscribe();
      subscription = undefined;
    }
    const observable = getObservable();
    if (observable) {
      subscription = observable.subscribe(observer);
    }
  });
});