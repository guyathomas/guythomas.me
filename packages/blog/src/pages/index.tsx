import React from "react";
import cx from "classnames";
import { GetStaticProps } from "next";
import { getSortedPostsData, PostMeta } from "~/lib/posts";
import PostSummary from "~/components/PostSummary";
import styles from "./index.module.css";

const POST_COUNT = 5;
interface HomeProps {
  allPostsData: PostMeta[];
}

function getIntersection<T>(setA: Set<T>, setB: Set<T>) {
  return new Set(Array.from(setA).filter((element) => setB.has(element)));
}

function getFrequencyMap<T>(input: T[]) {
  return input.reduce(
    (acc, item) => acc.set(item, (acc.get(item) || 0) + 1),
    new Map<T, number>()
  );
}

const MAX_VISIBLE_TAGS = 10;

const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h3 className="text-rose-600 uppercase font-normal">{children}</h3>
);

const Home: React.FC<HomeProps> = ({ allPostsData }) => {
  const [tagFilters, setTagFilters] = React.useState<Set<string>>(
    new Set<string>([])
  );

  const tagsByFrequency = React.useMemo(() => {
    const allTags = allPostsData.flatMap((post) => post.tags || []);
    const tagFrequencies = getFrequencyMap(allTags);
    return Array.from(tagFrequencies.entries())
      .sort((a, b) => (a[1] > b[1] ? -1 : 1))
      .map((el) => el[0])
      .slice(0, MAX_VISIBLE_TAGS);
  }, [allPostsData]);

  const filteredPostData = React.useMemo(() => {
    if (!tagFilters.size) return allPostsData; // No filters applied
    return allPostsData.filter(
      (post) => getIntersection(new Set(post.tags || []), tagFilters).size
    );
  }, [allPostsData, tagFilters]);

  return (
    <div className={cx("font-normal", "prose", "m-auto", styles.layout)}>
      <div className={cx("p-4", styles.recentPosts)}>
        <SectionTitle>Recent Posts</SectionTitle>
        <ul className="pl-0">
          {filteredPostData.map(({ id, date, title, description }) => (
            <li key={id} className="list-none pl-0">
              <PostSummary
                id={id}
                title={title}
                description={description}
                date={date}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className={cx("p-4", styles.tags)}>
        <SectionTitle>Tags</SectionTitle>
        <div className="pl-0 flex flex-wrap">
          {tagsByFrequency.map((tag) => (
            <button
              key={tag}
              className={cx(
                tagFilters.has(tag) ? "bg-cyan-500" : "bg-cyan-800",
                "pl-2",
                "pr-2",
                "text-white",
                "list-none",
                "pl-0",
                "p-1",
                "rounded-md",
                "leading-5",
                "mr-2",
                "flex-shrink-0",
                "mb-2"
              )}
              onClick={() => {
                const clonedFilters = Array.from(tagFilters);
                const newTagArray = tagFilters.has(tag)
                  ? clonedFilters.filter((existingTag) => existingTag !== tag)
                  : [...clonedFilters, tag];
                setTagFilters(new Set(newTagArray));
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    allPostsData: getSortedPostsData()
      .filter((post) => !post.tags.includes("notes"))
      .slice(0, POST_COUNT),
  },
});

export default Home;
