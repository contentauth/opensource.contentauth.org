This is how to set up your code to use the Node.js library.

```js
import { createC2pa } from 'c2pa-node';
import { readFile } from 'node:fs/promises';

const c2pa = createC2pa();
```

<!-- Comments from @tmathern

`import { readFile } from 'node:fs/promises';` looks unusual, but if it's in our code this way and works I would leave it.

More usual is `... from fs.promises`.

-->