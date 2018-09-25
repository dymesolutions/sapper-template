const path = require("path");
const fs = require("fs");

const sass = require("node-sass");
const ts = require("typescript");

const sharedSassFiles = [
  path.resolve("shared/scss/base.scss"),
  path.resolve("shared/scss/consts.scss")
];

const extractFolderPath = filePath => {
  if (!filePath) return "";

  const windowsFolderSep = "\\";
  const nixFolderSep = "/";

  const lastIndexOfWindowsSep = filePath.lastIndexOf(windowsFolderSep);
  const containsWindowsSeps = lastIndexOfWindowsSep >= 0;

  const lastIndexOfNixSep = filePath.lastIndexOf(nixFolderSep);
  const containsNixFolderSeps = lastIndexOfNixSep >= 0;

  let lastIndexOfFolderPath = -1;

  if (!containsWindowsSeps && !containsNixFolderSeps) return "";

  if (containsWindowsSeps) {
    lastIndexOfFolderPath = lastIndexOfWindowsSep;
  } else if (containsNixFolderSeps) {
    lastIndexOfFolderPath = lastIndexOfNixSep;
  } else {
    throw new Error(
      "Failed to figure out folder path from input string: " + filePath
    );
  }
  lastIndexOfFolderPath++; // to include the separator
  return filePath.substring(0, lastIndexOfFolderPath);
};

module.exports = {
  externalDependencies: [...sharedSassFiles],

  sass: function({ content, attributes, filename }) {
    if (attributes.type !== "text/scss") return { code: content, map: "" };
    console.log(`---- PREPROCESS/SASS: ${filename}`);
    return new Promise((resolve, reject) => {
      sass.render(
        {
          data: content,
          includePaths: ["src/shared/scss", "node_modules"],
          sourceMap: true,
          outFile: "x" // apparently required, although not used
        },
        (err, result) => {
          if (err) return reject(err);
          resolve({
            code: result.css.toString(),
            map: result.map.toString()
          });
        }
      );
    });
  },

  typescript: function({ content, attributes, filename }) {
    const { type, src } = attributes;

    // The param filename contains the .svelte file to preprocess.
    // The destructured src contains the relative filepath to desired .ts file (in relation to the location of the .svelte file)

    if (type !== "text/typescript" || !src || src.indexOf(".ts") === -1)
      return { code: content, map: "" };

    console.log(
      `==== PREPROCESS/TypeScript: ${filename} which refers ${attributes.src}`
    );

    const typeScriptFileLocationAbsolute = path.resolve(
      extractFolderPath(filename),
      src
    );
    console.log(
      `==== Expecting to find TypeScript file at: ${typeScriptFileLocationAbsolute}`
    );
    const referencedTsFile = fs.readFileSync(typeScriptFileLocationAbsolute);

    const compilerOptions = {
      sourceMap: true,
      target: "ES6",
      module: "ES2015",
      alwaysStrict: true
    };

    const transpileOptions = {
      compilerOptions
    };

    const transpiled = ts.transpileModule(
      referencedTsFile.toString(),
      transpileOptions
    );

    /*
     * The following dummy import is required to keep alive the reference from
     * a svelte file to a TS file in hot reloading. If missing, editing a TS file
     * will not cascade to the svelte files that reference the TS file, and thus
     * your changes won't show up.
     *
     * TODO: Figure out a better/prettier way to do this
     */
    const dummyImportTopFix =
      'import * as dummyImportToMakeSvelteTypeScriptWebpackIntegrationWork from "' +
      src.substring(0, src.length - 3) +
      '";\n';

    const transpiledPlusDummyImport =
      dummyImportTopFix + transpiled.outputText.toString();

    return {
      code: transpiledPlusDummyImport,
      map: transpiled.sourceMapText.toString()
    };
  }
};
