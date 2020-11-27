// utils
import { deepSpread } from './object.utils';

export function handleState(update, set) {
    return set(currentState => deepSpread({ ...currentState, ...update }));
}
