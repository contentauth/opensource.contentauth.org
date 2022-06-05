const fetch = require('node-fetch');
const { resolve } = require('path');
const { writeFile } = require('fs/promises');

const readmes = [
  {
    dest: resolve(__dirname, '../docs/rust-sdk/readme.md'),
    src: 'https://raw.githubusercontent.com/contentauth/c2pa-rs/main/README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/readme.md'),
    src: 'https://raw.githubusercontent.com/contentauth/c2pa-rs/main/c2patool/src/README.md',
  },
];

async function download() {
  for await (const { src, dest } of readmes) {
    const res = await fetch(src);
    const markdown = await res.text();
    await writeFile(dest, markdown, { encoding: 'utf-8', flag: 'w+' });
    console.log('Saved %s to %s', src, dest);
  }
}

download();
