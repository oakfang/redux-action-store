# redux-action-store
Save and load actions to persist state

## Install for server-side use of redux
```
npm i redux-action-store
```

## Simple usage
```js

// store.js
'use strict';

const redux = require('redux');
const app = require('./reducers');
const middleware = require('./middleware');
const ActionStore = require('redux-action-store');

// attempt to load actions from JSON file, otherwise create a blank one
const actionStore = ActionStore.fromJson('./actions.json', app);
// add SIGINT and beforeExit hook to save back to JSON file
actionStore.setPersistence('./actions.json');
/*
    You can also persist directly (sync) using: actionStore.toJson('./actions.json');
*/

module.exports = redux.applyMiddleware(...middleware, actionStore.storeActions)(actionStore.createStore)();
```

## Notes
- If using the `setPersistence` hooks, please make sure to exit explicitly on `CTRL-C`.
- As you should probably expect, replaying won't flare any side-effects (middleware).