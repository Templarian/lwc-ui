export function getImmutable(obj: any): any {
  const handler = {
    get: (target: any, key: any) => {
      const value = target[key];
      if (value && typeof value === 'object') {
        return getImmutable(value);
      }
      return value;
    },
    set: () => {
      return false;
    },
    deleteProperty: () => {
      return false;
    },
  };
  return new Proxy(obj, handler);
}

// wraps a value in an observable that emits one immutable value
export function getImmutableObservable(value: any) {
  return getSubject(getImmutable(value), undefined).observable;
}

// gets a subject with optional initial value and initial error
export function getSubject(initialValue: any, initialError: any): any {
  let observer: any;

  function next(value: any) {
    observer.next(value);
  }

  function error(err: any) {
    observer.error(err);
  }

  function complete() {
    observer.complete();
  }

  const observable = {
    subscribe: (obs: any) => {
      observer = obs;
      if (initialValue) {
        next(initialValue);
      }
      if (initialError) {
        error(initialError);
      }
      return {
        unsubscribe: () => { },
      };
    },
  };

  return {
    next,
    error,
    complete,
    observable,
  };
}