## Todo:

[ ] Handle errors

## Usage

Initialize registry hooks using a registry API key

```jsx
import { init } from '@cfce/registry-hooks';

init({
  registryApiKey: process.env.CFCE_REGISTRY_API_KEY,
  registryBaseUrl: 'https://registry.staging.cfce.io/api', // optional, for if you want to use the staging version, which you probably do
});
```

Wherever you want to run a given hook, use the `runHook` function.

```jsx
mintNFT() {
  import {runHook, Triggers} from '@cfce/registry';

  const initialMetadata = {a: 1};
  // runHook takes 3 params. 1. The Trigger name 2. The organizations to check and 3. Additional data that can be used by the the hook (currently just the below)
  const extraMetadata = runHook(Triggers.addMetadataToNFTReceiptReceipt, organizationId, {userId, walletId, organizationId}); // include metadata that might be used by the hooks.
}
```

## Context

Actions operate based on the context that's passed into them, and then have access to the context of all the actions that came before. When the hook is first called, the context that's passed in is assigned to `input`

### Input

The input context is special in two ways. First, it injects information that may be useful for the hook, such as the wallet address of the donor. Second, it includes special values, currently just `date`, which is a timestamp at the time of execution of the hook. This date value can be used with the `math` action to add a date filter to an API request, for example.

## Actions

This package provides the following main actions:

### `fetchDataFromApi(context, parameters)`

Fetches data from an API. The `context` is an object that stores data as it passes through the hook. The `parameters` object should have the following properties:

- `endpoint`: The API endpoint to fetch data from.
- `method`: The HTTP method to use.
- `body`: The body of the request.
- `headers`: The headers of the request.

Example usage:

```javascript
import { fetchDataFromApi } from '@cfce/registry/src/actions';

fetchDataFromApi(context, {
  endpoint: 'https://api.example.com/data',
  method: 'GET',
  body: {},
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## math(context, parameters)

Performs a mathematical operation. The context is an object that stores data as it passes through the hook. The parameters object should have the following properties:
 - operation: The operation to perform. This can be "multiply", "divide", "add", or "subtract".
 - operands: An array of numbers to perform the operation on.

Example usage:
```javascript
import { math } from '@cfce/registry/src/actions';

math(context, {
  operation: 'add',
  operands: [1, 2, 3, 4, 5],
});
```

## transform(context, parameters)
Transforms data. The context is an object that stores data as it passes through the hook. The parameters object should have the following properties:
 - path: The path of the data to transform.
 - value: The value to transform the data to.
 ```javascript
import { transform } from '@cfce/registry/src/actions';

transform(context, {
  path: 'data.value',
  value: 'newValue',
});
```
## createStory(context, parameters)
Creates a story. The context is an object that stores data as it passes through the hook. The parameters object should have the following properties:

 - title: The title of the story.
 - content: The content of the story.

 Example usage:
 ```javascript
import { createStory } from '@cfce/registry/src/actions';

createStory(context, {
  title: 'My Story',
  content: 'Once upon a time...',
});
```

## createStories(context, parameters)
Creates multiple stories. The context is an object that stores data as it passes through the hook. The parameters object should be an array where each element is an object with the following properties:

 - title: The title of the story.
 - content: The content of the story.

 Example usage:
 ```javascript
import { createStories } from '@cfce/registry/src/actions';

createStories(context, [
  {
    title: 'My First Story',
    content: 'Once upon a time...',
  },
  {
    title: 'My Second Story',
    content: 'In a land far, far away...',
  },
]);
```

## transformEach(context, parameters)
Transforms each item in the data. The context is an object that stores data as it passes through the hook. The parameters object should have the following properties:

 - path: The path to the data to transform.
 - value: The value to transform the data to.

 Example usage:
 ```javascript
import { transformEach } from '@cfce/registry/src/actions';

transformEach(context, {
  path: 'data.values',
  value: 'newValue',
});
```

# Adding actions
1. Create a new action script in the `/src/actions` folder
2. In `src/actions/index.ts`, add your action to the `Actions` type and to the exported `actions`
3. In `src/types.ts`, add the action to the `ActionTypes` const and add the params to `ContextParams`
4. Add tests in `src/actions/__tests__`