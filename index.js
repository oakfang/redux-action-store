'use strict';

const fs = require('fs');
const redux = require('redux');

class ActionStore {
    constructor(reducer, history) {
        this.history = history || [];
        this.reducer = reducer;
        this._store = redux.createStore(reducer);

        this.createStore = this.createStore.bind(this);
    }

    static fromJson(path, reducer) {
        try {
            return new ActionStore(reducer, JSON.parse(fs.readFileSync(path, {encoding: 'utf8'})).history);
        } catch (err) {
            return new ActionStore(reducer);
        }
    }

    get storeActions() {
        return store => next => action => {
            this.record(action);
            return next(action);
        }
    }

    record(action) {
        this.history.push(action);
    }

    createStore(reducer) {
        this.history.forEach(this._store.dispatch.bind(this._store));
        return redux.createStore(reducer || this.reducer, this._store.getState());
    }

    toJson(path) {
        fs.writeFileSync(path, JSON.stringify({
            history: this.history
        }));
    }

    setPersistence(path) {
        process.on('beforeExit', () => this.toJson(path));
        process.on('SIGINT', () => {
            this.toJson(path);
        }); 
        return this;
    }
}

module.exports = ActionStore;