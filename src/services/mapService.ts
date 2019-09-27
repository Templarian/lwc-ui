import { register, ValueChangedEvent } from '@lwc/wire-service';
import { getSubject } from './util';

export function getObservable(config: any) {
    if (!config || !('id' in config)) {
        return undefined;
    }
    const subject = getSubject(undefined, undefined);
    if (config.id !== null) {
        fetch(`mock/mock.${config.id}.json`)
            .then(data => data.json())
            .then(data => {
                console.log(data);
                subject.next(data);
            }, () => {
                subject.error({ message: 'Failed to load map.' })
            });
    }
    return subject.observable;
}

export function getMap(config: any) {
    return new Promise((resolve, reject) => {
        const observable = getObservable(config);
        if (!observable) {
            return reject(new Error('Dev: id required'));
        }

        observable.subscribe({
            next: (value: any) => resolve(value),
            error: (error: any) => reject(error),
            complete: resolve,
        });
    });
}

register(getMap, function getMapWireAdapter(wiredEventTarget) {
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