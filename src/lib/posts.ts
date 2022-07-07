import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import transformCodeSandbox from "./transformCodesandbox";

const blogDirectory = path.join(process.cwd(), "content/blog");
const ignoredFilesSet = new Set([
  "node_modules",
  "yarn.lock",
  "package-lock.json",
]);

const getAbsoluteFilepaths = (dirPath) =>
  fs.readdirSync(dirPath).reduce((acc, file) => {
    if (ignoredFilesSet.has(file)) return acc;
    const relativePath = dirPath + "/" + file;
    const isDirectory = fs.statSync(relativePath).isDirectory();
    const additions = isDirectory
      ? getAbsoluteFilepaths(relativePath)
      : [relativePath];
    return [...acc, ...additions];
  }, []);

const postPathRegex = new RegExp(`${blogDirectory}(.*)\.md`);

const getPostPathFromAbsoluteFile = (absolutePath: string) =>
  absolutePath.match(postPathRegex)[1];

interface MatterResult {
  date: string;
  title: string;
  draft?: boolean;
  description?: string;
}

export const getSortedPostsData = () =>
  getAbsoluteFilepaths(blogDirectory)
    .map((fileName) => {
      const postPath = getPostPathFromAbsoluteFile(fileName);
      const fileContents = fs.readFileSync(fileName, "utf8");
      const matterResult = matter(fileContents);
      return {
        id: postPath,
        ...(matterResult.data as MatterResult),
      };
    })
    .filter((postMeta) => !postMeta.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getAllPostIds = () =>
  getAbsoluteFilepaths(blogDirectory)
    .map(getPostPathFromAbsoluteFile)
    .map((id) => ({
      params: {
        id: id.split("/").filter(Boolean),
      },
    }));

export async function getPostData(id: string) {
  const fullPath = path.join(blogDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkHtml, { sanitize: false })
    .use(transformCodeSandbox)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string }),
  };
}
