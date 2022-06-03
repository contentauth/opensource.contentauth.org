const {
  generateMarkdownFiles,
} = require('docusaurus-plugin-api-extractor/dist/generate-docs');
const { program } = require('commander');
const { resolve } = require('path');

const DEFAULT_INPUT_DIR = resolve(__dirname, '../../c2pa-js/common/api');
const DEFAULT_OUT_DIR = resolve(__dirname, '../docs/js-sdk/api');

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
const config = {
  docModel: {
    // We append model.json here since it will strip the file name and just look at the directory
    apiJsonFilePath: `${options.inputDir}/model.json`,
  },
};
generateMarkdownFiles('', options.outDir, config);
