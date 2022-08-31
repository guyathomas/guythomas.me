import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import dayjs from "dayjs";
import { getAllPostIds, getPostData, FullPost } from "~/lib/posts";
interface PostProps {
  postData: FullPost;
}

const Post: React.FC<PostProps> = ({ postData }) => (
  <div className="prose prose-slate m-auto">
    <Head>
      <title>{postData.title}</title>
    </Head>
    <article>
      <div className="bx-container bg-blue-300 pt-16 pb-4 md:pt-32 md:pb-8 ">
        <div className="p-4 md:p-0">
          <h1>{postData.title}</h1>
          {postData.date && (
            <div>{dayjs(postData.date).format("MMMM D, YYYY")}</div>
          )}
        </div>
      </div>
      <div
        className="p-4 md:p-0"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </article>
  </div>
);

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getAllPostIds(),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(
    Array.isArray(params.id) ? params.id.join("/") : params.id
  );
  return {
    props: {
      postData,
    },
  };
};

export default Post;
