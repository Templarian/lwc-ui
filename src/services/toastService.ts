import { register, ValueChangedEvent } from '@lwc/wire-service';
import { getSubject } from './util';
import Toast from 'models/toast';

const toasts: Toast[] = [];
const subject = getSubject([], undefined);

export function getObservable(config: any) {
  return subject.observable;
}

let uniqueId = 0;

function pushToast(toast: Toast) {
  toast.id = uniqueId++;
  toasts.push(toast);
  subject.next(toasts);
  if (toast.seconds) {
    setTimeout(() => {
      removeToast(toast.id)
    }, toast.seconds * 1000);
  }
  return toast.id;
}

export function toast(message: string, seconds = 0) {
  var toast = new Toast();
  toast.message = message;
  toast.seconds = seconds;
  return pushToast(toast);
}

export function errorToast(message: string, seconds = 0) {
  var toast = new Toast();
  toast.message = message;
  toast.seconds = seconds;
  toast.variant = 'error';
  return pushToast(toast);
}

export function warningToast(message: string, seconds = 0) {
  var toast = new Toast();
  toast.message = message;
  toast.seconds = seconds;
  toast.variant = 'warning';
  return pushToast(toast);
}

export function loadingToast(message: string, seconds = 0) {
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

export function getToasts(config: any) {
  return new Promise((resolve, reject) => {
    const observable = getObservable(config);
    if (!observable) {
      return reject(new Error('Dev: invalid observable'));
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
  let config: any;

  wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error: undefined }));

  const observer = {
    next: (data: any) =>
      wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data, error: undefined })),
    error: (error: any) =>
      wiredEventTarget.dispatchEvent(new ValueChangedEvent({ data: undefined, error }))
  };

  wiredEventTarget.addEventListener('connect', () => {
    const observable = getObservable(config);
    if (observable) {
      subscription = observable.subscribe(observer);
    }
  });

  wiredEventTarget.addEventListener('disconnect', () => {
    subscription.unsubscribe();
  });

  wiredEventTarget.addEventListener('config', newConfig => {
    config = newConfig;
    if (subscription) {
      subscription.unsubscribe();
      subscription = undefined;
    }
    const observable = getObservable(config);
    if (observable) {
      subscription = observable.subscribe(observer);
    }
  });
});