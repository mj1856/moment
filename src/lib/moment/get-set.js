import { normalizeUnits } from '../units/aliases';
import { hooks } from '../utils/hooks';
import isFunction from '../utils/is-function';

export function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

export function get (mom, unit) {
    return mom.isValid() ?
        (new Date(mom._t))['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN; // TODO: calc without Date object
}

export function set (mom, unit, value) {
    if (mom.isValid()) {
        var d = new Date(mom._t);
        d['set' + (mom._isUTC ? 'UTC' : '') + unit](value); // TODO: calc without Date object
        mom._t = d.valueOf();
    }
}

// MOMENTS

export function getSet (units, value) {
    var unit;
    if (typeof units === 'object') {
        for (unit in units) {
            this.set(unit, units[unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}
