Although you can use [`@contentauth/c2pa-web`](https://github.com/contentauth/c2pa-js/tree/main/packages/c2pa-web) to build manifests and sign assets in the browser using a remote signing service, doing so presents a security vulnerability because someone can use an authenticated session to call the signing endpoint to sign any asset.

Instead, perform signing using one of the other libraries, for example, Node.js, C++, or Python.
