import fs from "fs";
import path from "path";
import LZString from "lz-string";
import { visit } from "unist-util-visit";
import { u } from "unist-builder";

import normalizePath from "normalize-path";
import queryString from "query-string";

const DEFAULT_PROTOCOL = "embedded-codesandbox://";
const CODESANDBOX_ROOT_DIRECTORY = path.join(
  process.cwd(),
  "content/codesandbox/"
);
const getIframeHtml = (url) =>
  `<iframe src="${url}" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

const getPackageJsonFile = (fileList) =>
  fileList.find((file) => file.includes("package.json"));

const compress = (string) =>
  LZString.compressToBase64(string)
    .replace(/\+/g, `-`) // Convert '+' to '-'
    .replace(/\//g, `_`) // Convert '/' to '_'
    .replace(/=+$/, ``); // Remove ending '='

const getDirectoryPath = (url, protocol, rootDirectory) => {
  const directoryPath = url.replace(protocol, "");
  const fullPath = path.join(rootDirectory, directoryPath);
  return normalizePath(fullPath);
};
const ignoredFilesSet = new Set([
  "node_modules",
  "package-lock.json",
  "yarn.lock",
]);

const getAllProjectFiles = (directory) =>
  fs.readdirSync(directory).reduce((acc, file) => {
    if (ignoredFilesSet.has(file)) return acc;
    const relativePath = directory + "/" + file;
    const isDirectory = fs.statSync(relativePath).isDirectory();
    const additions = isDirectory
      ? getAllProjectFiles(relativePath)
      : [relativePath];
    return [...acc, ...additions];
  }, []);

const getFilesList = (directory) => {
  let packageJsonFound = false;
  const folderFiles = getAllProjectFiles(directory);
  const basePathRE = new RegExp(`^${directory}/`);
  const sandboxFiles = folderFiles
    .map((file) => file.replace(basePathRE, ""))
    .filter((file) => !file.includes("package.json"))
    .map((relativePath) => {
      const fullFilePath = path.resolve(__dirname, directory, relativePath);
      const content = fs.readFileSync(fullFilePath, "utf-8");
      return {
        name: relativePath,
        content,
      };
    });
  let workingDir = directory;
  while (!packageJsonFound) {
    const files = fs.readdirSync(workingDir);
    const packageJson = getPackageJsonFile(files);
    if (packageJson) {
      const fullFilePath = path.resolve(workingDir, "package.json");
      const content = fs.readFileSync(fullFilePath, "utf-8");
      sandboxFiles.push({
        name: "package.json",
        content,
      });
      packageJsonFound = true;
      // if root folder is reached, use a fallback default
      // value as content, to ensure the sandbox is always working
    } else if (
      path.resolve(workingDir) === path.resolve(CODESANDBOX_ROOT_DIRECTORY)
    ) {
      sandboxFiles.push({
        name: "package.json",
        content: '{ "name": "example" }',
      });
      packageJsonFound = true;
      // if not present, work up the folders
    } else {
      workingDir = path.join(workingDir, "..");
    }
  }

  return sandboxFiles;
};

const createIframeOptions = (query) =>
  encodeURIComponent(
    queryString.stringify({
      view: "preview",
      hidenavigation: 1,
      ...query,
    })
  );

const createParams = (filesArr) => {
  const files = filesArr.reduce((prev, current) => {
    const content = current.name.includes("package.json")
      ? JSON.parse(current.content)
      : current.content;
    prev[current.name] = { content };
    return prev;
  }, {});
  const params = {
    files,
  };
  return compress(JSON.stringify(params));
};

const transformCodeSandbox = () => (ast) => {
  visit(ast, "link", visitor);

  function visitor(node, _index, parent) {
    if (node.url.startsWith(DEFAULT_PROTOCOL)) {
      const [baseUrl, query] = node.url.split("?");
      const dir = getDirectoryPath(
        baseUrl,
        DEFAULT_PROTOCOL,
        CODESANDBOX_ROOT_DIRECTORY
      );
      const files = getFilesList(dir);
      const params = createParams(files);
      const iframeOptions = createIframeOptions(query);
      const index = parent.children.indexOf(node);
      const iframeUrl = `https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=${params}&query=${iframeOptions}`;
      const iframe = u("html", {
        value: getIframeHtml(iframeUrl),
      });
      parent.children.splice(index, 1, iframe);
    }
  }
};

export default transformCodeSandbox;
