import Link from "next/link";
import { GetStaticProps } from "next";
import Layout from "~/components/Layout";
import { getSortedPostsData } from "~/lib/posts";

interface HomeProps {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
}
const Home: React.FC<HomeProps> = ({ allPostsData }) => (
  <Layout>
    <section>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/blog${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            {date && <small>{date}</small>}
          </li>
        ))}
      </ul>
    </section>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    allPostsData: getSortedPostsData(),
  },
});

export default Home;
