// copy-config.js
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// .../app/
const initializationPath = process.env.INIT_CWD;
// const appId = process.env.APP_ID;
const appId = process.env.AWS_NFT_BUCKET;
// .../package/src
const directoryPath = `${process.cwd()}/dist/${appId}`;
// const directoryPath = `${process.cwd()}/dist`;
const environments = ['development', 'staging', 'production'];

function compileTypeScript(filePath, outputPath) {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.ES2018,
    true,
  );

  const compilerOptions = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2018,
    esModuleInterop: true,
  };

  const result = ts.transpileModule(sourceFile.text, {
    compilerOptions: compilerOptions,
    fileName: filePath,
  });

  fs.writeFileSync(outputPath, result.outputText);
}

// only check app directory
console.log(
  'directoryPath',
  directoryPath,
  directoryPath.match(/cfce-monorepo\/app/),
);
if (!directoryPath.match(/cfce-monorepo\/app/)) {
  console.log('not installed in app directory');
  process.exit(0);
}

for (const env of environments) {
  const configFilename = `appConfig.${env}.ts`;
  const configPath = path.join(initializationPath, configFilename);

  // Check if the config file exists
  if (!fs.existsSync(configPath)) {
    console.error(`Error: Config file not found: ${configPath}`);
    process.exit(1); // Exit with an error code to indicate failure
  }

  // create dist directory if it doesn't exist
  console.log('appid', process.env);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // Compile the TypeScript file and output it to the package directory
  const outputPath = path.join(
    directoryPath,
    configFilename.replace('.ts', '.js'),
  );
  compileTypeScript(configPath, outputPath);
  console.log(`Compiled config file from ${configPath} to ${outputPath}`);
}
