import Link from "next/link";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "~/lib/posts";
import PostSummary from "~/components/PostSummary";

const POST_COUNT = 5;
interface HomeProps {
  allPostsData: {
    date: string;
    title: string;
    id: string;
    description: string;
    subtitle?: string;
  }[];
}
const Home: React.FC<HomeProps> = ({ allPostsData }) => {
  return (
    <section>
      <h2>Posts</h2>
      <ul>
        {allPostsData.map(({ id, date, title, description, subtitle }) => (
          <li key={id}>
            <PostSummary
              target={id}
              title={title}
              description={description}
              subtitle={subtitle}
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
