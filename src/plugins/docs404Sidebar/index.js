/**
 * Resolves the "docs" sidebar (declared in sidebars.js) into a fully
 * hydrated tree (doc ids -> permalinks) at build time, using the same raw
 * data the docs plugin itself uses for `toSidebarsProp`. This lets the 404
 * page render the real docs sidebar even though it has no specific doc (and
 * therefore no sidebar) in its route context.
 */
module.exports = function docs404SidebarPlugin() {
  return {
    name: 'docs-404-sidebar-plugin',
    async allContentLoaded({ allContent, actions }) {
      const docsContent = allContent['docusaurus-plugin-content-docs']?.default;
      const loadedVersion = docsContent?.loadedVersions?.[0];
      const rawSidebar = loadedVersion?.sidebars?.docs;
      if (!loadedVersion || !rawSidebar) {
        return;
      }

      const docsById = new Map(loadedVersion.docs.map((doc) => [doc.id, doc]));

      function resolveCategoryHref(link) {
        if (!link) {
          return undefined;
        }
        if (link.type === 'doc') {
          return docsById.get(link.id)?.permalink;
        }
        if (link.type === 'generated-index') {
          return link.permalink;
        }
        return undefined;
      }

      function normalizeItem(item) {
        if (item.type === 'category') {
          const items = item.items.map(normalizeItem).filter(Boolean);
          if (items.length === 0) {
            return null;
          }
          const href = resolveCategoryHref(item.link);
          return {
            type: 'category',
            label: item.label,
            collapsed: item.collapsed,
            collapsible: item.collapsible,
            items,
            ...(href && { href }),
          };
        }
        if (item.type === 'doc' || item.type === 'ref') {
          const doc = docsById.get(item.id);
          if (!doc || doc.unlisted) {
            return null;
          }
          return {
            type: 'link',
            label: doc.frontMatter?.sidebar_label ?? item.label ?? doc.title,
            href: doc.permalink,
          };
        }
        if (item.type === 'link') {
          return item;
        }
        return null;
      }

      const sidebar = rawSidebar.map(normalizeItem).filter(Boolean);

      actions.setGlobalData({ sidebar });
    },
  };
};
