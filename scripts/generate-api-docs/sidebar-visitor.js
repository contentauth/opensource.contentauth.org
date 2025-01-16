const { ApiItemKind } = require('@microsoft/api-extractor-model');

/**
 * @dkozma: The API model parsed an `IndexSignature` from `c2pa.manifestresolvers`, which gets picked up by the sidebar but a file doesn't get generated.
 * HACK: Strip the `._indexer_` suffix since standard-markdown-documenter doesn't seem to let
 * you return an empty node or node that returns a valid `html` or `link` type.
 */
exports.SIDEBAR_VISITOR = {
  [ApiItemKind.Package]: containerNode,
  [ApiItemKind.Namespace]: containerNode,
  [ApiItemKind.Interface]: containerNode,
  [ApiItemKind.Class]: containerNode,
  [ApiItemKind.CallSignature]: terminalNode,
  [ApiItemKind.ConstructSignature]: terminalNode,
  [ApiItemKind.Constructor]: terminalNode,
  [ApiItemKind.Enum]: terminalNode,
  [ApiItemKind.EnumMember]: terminalNode,
  [ApiItemKind.Function]: terminalNode,
  [ApiItemKind.IndexSignature]: (apiItem, meta) =>
    terminalNode(apiItem.displayName, meta.id.replace(/._indexer_$/, '')),
  [ApiItemKind.Method]: terminalNode,
  [ApiItemKind.MethodSignature]: terminalNode,
  [ApiItemKind.Property]: terminalNode,
  [ApiItemKind.PropertySignature]: terminalNode,
  [ApiItemKind.TypeAlias]: terminalNode,
  [ApiItemKind.Variable]: terminalNode,
  [ApiItemKind.Model]: () => ({
    type: 'category',
    label: 'Packages',
    items: [terminalNode('Overview', 'index')],
    collapsed: false,
  }),
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
