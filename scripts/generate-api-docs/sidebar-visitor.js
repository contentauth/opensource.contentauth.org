const { ApiItemKind } = require('@microsoft/api-extractor-model');

/**
 * This is taken from the docusaurus-plugin-api-extractor codebase as specified in the
 * [standard-markdown-documenter README](https://github.com/gabrielcsapo/docusaurus-plugin-api-extractor/tree/main/plugin/standard-markdown-documenter#custom-sidebar-visitor).
 * @see https://github.com/gabrielcsapo/docusaurus-plugin-api-extractor/tree/main/plugin/standard-markdown-documenter#custom-sidebar-visitor
 *
 * @dkozma: We had to change this code because the API model parsed an `IndexSignature` from `c2pa.manifestresolvers`
 * which gets picked up by the sidebar but a file doesn't get generated. I'm not sure why this is the case or how to
 * fix it, so I put a hack in here to just strip the `._indexer_` suffix since standard-markdown-documenter doesn't
 * seem to let me return an empty node or node that returns a valid `html` or `link` type.
 */
exports.SIDEBAR_VISITOR = {
  [ApiItemKind.Package](apiItem, meta) {
    return containerNode(apiItem, meta);
  },
  [ApiItemKind.Namespace](apiItem, meta) {
    return containerNode(apiItem, meta);
  },
  [ApiItemKind.Interface](apiItem, meta) {
    return containerNode(apiItem, meta);
  },
  [ApiItemKind.Class](apiItem, meta) {
    return containerNode(apiItem, meta);
  },
  [ApiItemKind.CallSignature](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },
  [ApiItemKind.ConstructSignature](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },
  [ApiItemKind.Constructor](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },
  [ApiItemKind.Enum](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.EnumMember](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.Function](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.IndexSignature](apiItem, meta) {
    return terminalNode(
      apiItem.displayName,
      meta.id.replace(/._indexer_$/, ''),
    );
  },

  [ApiItemKind.Method](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.Method](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.MethodSignature](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.Property](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.PropertySignature](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.TypeAlias](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.Variable](apiItem, meta) {
    return terminalNode(apiItem.displayName, meta.id);
  },

  [ApiItemKind.Model]() {
    return {
      type: 'category',
      label: 'Packages',
      items: [terminalNode('Overview', 'index')],
      collapsed: false,
    };
  },
};

function containerNode(apiItem, meta) {
  return {
    type: 'category',
    label: apiItem.displayName,
    collapsed: shouldCollapse(apiItem.kind),
    items: [terminalNode('Overview', meta.id)],
  };
}

function terminalNode(displayName, id) {
  return {
    type: 'doc',
    label: displayName,
    id: id,
  };
}

function shouldCollapse(kind) {
  return kind === 'Class' || kind === 'Namespace' || kind === 'Interface';
}
