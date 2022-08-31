import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
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
      <div>
        <h1>{postData.title}</h1>
        {postData.date && <div>{postData.date}</div>}
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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
