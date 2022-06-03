import React, { useEffect, useRef } from 'react';
import sbSdk from '@stackblitz/sdk';

const codeSandboxDefaults = {
  settings: {
    autoresize: 1,
    codemirror: 1,
    runonclick: 1,
    expanddevtools: 0,
    previewwindow: 'console',
    hidenavigation: 1,
    fontsize: 12,
    moduleview: 1,
    editorsize: 60,
    theme: 'dark',
  },
  styles: {
    width: '100%',
    height: '600px',
    border: 0,
    borderRadius: '4px',
    overflow: 'hidden',
  },
};

const CodeSandbox = ({
  example = 'minimal-ts-vite',
  file,
  browserPath,
  size = 'medium',
  displayType = 'console',
  opts = {},
}) => {
  const settings = {
    ...codeSandboxDefaults.settings,
    module: file,
    initialpath: browserPath ?? file.replace(/main\.ts$/, 'index.html'),
  };
  if (displayType === 'preview') {
    settings.previewwindow = 'browser';
  }
  const styles = {
    ...codeSandboxDefaults.styles,
  };
  if (size === 'small') {
    styles.height = '300px';
  } else if (size === 'large') {
    styles.height = '900px';
  }
  const params = new URLSearchParams({ ...settings, ...opts.settings });
  const src = `https://codesandbox.io/embed/github/dkozma/c2pa-js/tree/update-examples/examples/${example}?${params.toString()}`;

  return (
    <iframe
      src={src}
      style={{ ...styles, ...opts.styles }}
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
  );
};

const stackBlitzDefaults = {
  settings: {
    forceEmbedLayout: true,
    devToolsHeight: 300,
    clickToLoad: true,
    width: '100%',
    height: 800,
  },
  styles: {
    border: 0,
    borderRadius: '4px',
  },
};

const StackBlitz = ({
  example = 'minimal-ts-vite',
  file,
  browserPath,
  size = 'medium',
  displayType = 'console',
  opts = {},
}) => {
  const ref = useRef();
  const settings = {
    ...stackBlitzDefaults.settings,
    ...opts.settings,
    openFile: file,
    initialPath: browserPath ?? file.replace(/main\.ts$/, 'index.html'),
  };
  const styles = stackBlitzDefaults.styles;
  if (size === 'small') {
    settings.height = '300px';
  } else if (size === 'large') {
    settings.height = '900px';
  }

  useEffect(() => {
    (async () => {
      if (ref.current) {
        const project = await sbSdk.embedGithubProject(
          ref.current,
          `dkozma/c2pa-js/tree/update-examples/examples/${example}`,
          settings,
        );
      }
    })();
  }, []);

  const params = new URLSearchParams();
  const src = `https://stackblitz.com/github/dkozma/c2pa-js/tree/update-examples/examples/${example}?${params.toString()}`;

  return <div ref={ref} style={{ ...styles, ...opts.styles }}></div>;
};

export default CodeSandbox;
