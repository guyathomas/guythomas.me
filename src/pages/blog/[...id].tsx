import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import { GetStaticProps, GetStaticPaths } from "next";

interface PostProps {
  postData: {
    title: string;
    date: string;
    contentHtml: string;
  };
}

const Post: React.FC<PostProps> = ({ postData }) => (
  <Layout>
    <div className="prose prose-slate">
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1>{postData.title}</h1>
        {postData.date && (
          <div>
            <Date dateString={postData.date} />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  </Layout>
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
