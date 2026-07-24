/**
 * Docusaurus's broken-link checker collects links from rendered <a> elements
 * regardless of CSS visibility, so links inside GitHub-only content (hidden on
 * this site via the "github-only" class or a display:none style, but meant to
 * work when the source markdown is viewed on GitHub) get flagged as broken.
 *
 * This plugin unwraps markdown links found inside such hidden containers,
 * before they become <a> elements, so they're never collected.
 */

const CLASS_RE = /(^|\s)github-only(\s|$)/;
const DISPLAY_NONE_RE = /display\s*:\s*['"]none['"]/;

function isHiddenDiv(node) {
  if (
    !node ||
    (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') ||
    node.name !== 'div'
  ) {
    return false;
  }
  const attributes = node.attributes || [];
  return attributes.some((attr) => {
    if (attr.type !== 'mdxJsxAttribute') return false;
    if (
      (attr.name === 'class' || attr.name === 'className') &&
      typeof attr.value === 'string'
    ) {
      return CLASS_RE.test(attr.value);
    }
    if (attr.name === 'style') {
      const raw =
        attr.value && typeof attr.value === 'object'
          ? attr.value.value
          : attr.value;
      return typeof raw === 'string' && DISPLAY_NONE_RE.test(raw);
    }
    return false;
  });
}

// Replace link/linkReference nodes with their child content, in place.
function stripLinks(node) {
  if (!node || !Array.isArray(node.children)) return;
  node.children = node.children.flatMap((child) => {
    stripLinks(child);
    if (child.type === 'link' || child.type === 'linkReference') {
      return child.children || [];
    }
    return [child];
  });
}

function visit(node) {
  if (!node) return;
  if (isHiddenDiv(node)) {
    // stripLinks recurses through the whole hidden subtree itself.
    stripLinks(node);
    return;
  }
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => visit(child));
  }
}

function remarkStripHiddenLinks() {
  return (tree) => {
    visit(tree);
  };
}

module.exports = remarkStripHiddenLinks;
