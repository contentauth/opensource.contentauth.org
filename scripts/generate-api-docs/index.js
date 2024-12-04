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
const { exec } = require('child_process');
// Added to remove pagination
const path = require('path');
const noPaginationFrontMatterStr =
  '---\npagination_next: null\npagination_prev: null\n---\n';

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

// Added to remove pagination
function appendStringToFiles(directory, stringToAppend) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        const updatedData = stringToAppend + data;

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }

          //console.log(`Appended "${stringToAppend}" to ${file}`);
        });
      });
    });
  });
}

async function generateSidebarFile(inputDir, outDir) {
  try {
    ensureDirSync(outDir);

    const model = new ApiModel();

    const globs = glob(`${inputDir}/*.json`);

    for (const resolvedPath of globs) {
      model.loadPackage(resolvedPath);
    }

    const documenter = new StandardMarkdownDocumenter(model, outDir);

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

async function generateMarkdownFiles(inputDir, outDir) {
  return new Promise((resolve, reject) => {
    exec(
      `api-documenter markdown --input-folder ${inputDir} --output-folder ${outDir}`,
      (err, stdout) => {
        if (err) {
          return reject(err);
        }

        return resolve(stdout);
      },
    );
  });
}

(async () => {
  try {
    await generateMarkdownFiles(options.inputDir, options.outDir);
    // Added to remove pagination
    await appendStringToFiles(options.outDir, noPaginationFrontMatterStr);
    await generateSidebarFile(options.inputDir, options.outDir);
  } catch (e) {
    console.error(e);
  }
})();
