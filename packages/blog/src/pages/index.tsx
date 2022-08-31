import Link from "next/link";
import { GetStaticProps } from "next";
import { getSortedPostsData, PostMeta } from "~/lib/posts";
import PostSummary from "~/components/PostSummary";

const POST_COUNT = 5;
interface HomeProps {
  allPostsData: PostMeta[];
}
const Home: React.FC<HomeProps> = ({ allPostsData }) => {
  return (
    <section>
      <h2>Posts</h2>
      <ul>
        {allPostsData.map(({ id, date, title, description }) => (
          <li key={id}>
            <PostSummary
              id={id}
              title={title}
              description={description}
              date={date}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    allPostsData: getSortedPostsData().slice(0, POST_COUNT),
  },
});

export default Home;
