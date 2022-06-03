const { join, resolve } = require('path');
const { program } = require('commander');
const { SIDEBAR_VISITOR } = require('./sidebar-visitor');
const fs = require('fs');
const { ensureDirSync, writeFileSync } = require('fs-extra');
const { sync: glob } = require('glob');
const { ApiModel } = require('@microsoft/api-extractor-model');
const { StandardMarkdownDocumenter } = require('standard-markdown-documenter');
const ejs = require('ejs');
const prettier = require('prettier');

const sidebar = fs.readFileSync(join(__dirname, './api-sidebar.ejs'), 'utf-8');
const tree = fs.readFileSync(
  join(__dirname, './api-sidebar-tree.ejs'),
  'utf-8',
);

const sidebarTmpl = ejs.compile(sidebar);
const treeTmpl = ejs.compile(tree);

const DEFAULT_INPUT_DIR = resolve(__dirname, '../../../c2pa-js/common/api');
const DEFAULT_OUT_DIR = resolve(__dirname, '../../docs/js-sdk/api');

program
  .name('generate-api-docs')
  .description('Generates markdown API docs from c2pa-js')
  .option(
    '--inputDir',
    'Path to JSON files created by api-extractor',
    DEFAULT_INPUT_DIR,
  )
  .option('--outDir', 'Specify where files should go', DEFAULT_OUT_DIR);

const options = program.opts();

function isSideBarItem(items) {
  return (
    Array.isArray(items) &&
    typeof items[0] === 'object' &&
    items[0] !== null &&
    'type' in items[0]
  );
}

/**
 * This is a custom version of `generateMarkdownFiles` from the docusaurus-plugin-api-extractor repo:
 * @see https://github.com/gabrielcsapo/docusaurus-plugin-api-extractor/blob/f3c2afdf1488e90a253482ee23ab8ea798d38a58/plugin/docusaurus-plugin-api-extractor/src/generate-docs.ts#L134-L172
 *
 * @param {string} inputDir
 * @param {string} outDir
 */
async function generateMarkdownFiles(inputDir, outDir) {
  try {
    ensureDirSync(outDir);

    const model = new ApiModel();

    const globs = glob(`${inputDir}/*.json`);

    for (const resolvedPath of globs) {
      model.loadPackage(resolvedPath);
    }

    const documenter = new StandardMarkdownDocumenter(model, outDir);
    await documenter.generateFiles();

    const sidebarNodes = await documenter.generateSidebar(SIDEBAR_VISITOR);

    const sidebarFile = prettier.format(
      sidebarTmpl({
        sideBarItems: sidebarNodes,
        dir: 'api',
        isSideBarItem,
        tree: treeTmpl,
      }),
      { parser: 'babel', singleQuote: true },
    );

    writeFileSync(join(outDir, 'api-sidebar.js'), sidebarFile);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
}

generateMarkdownFiles(options.inputDir, options.outDir);
