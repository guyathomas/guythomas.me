import Head from "next/head";
import Resume, { ResumeType } from "components/Resume";
import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { GetStaticProps } from "next";

interface IndexProps {
  resumeData: ResumeType;
}
const Index: React.FC<IndexProps> = ({ resumeData }) => (
  <>
    <Head>
      <title>Guy Thomas</title>
    </Head>
    <Resume resumeData={resumeData} />
  </>
);

export const getStaticProps: GetStaticProps<IndexProps> = () => {
  const resumePath = path.join(process.cwd(), "content/resume.yaml");
  const file = fs.readFileSync(resumePath, "utf8");
  const resumeData = parse(file) as ResumeType;
  return {
    props: {
      resumeData,
    },
  };
};

export default Index;
