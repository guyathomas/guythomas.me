import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { GetStaticProps } from "next";

interface HistoryItem {
  date?: string;
  company?: string;
  title?: string;
  details?: string;
}

interface ResumeType {
  id: string;
  version?: number;
  tagline?: string;
  intro?: string;
  contactDetails?: Array<Array<string>>;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  experience?: Array<HistoryItem>;
  education?: Array<HistoryItem>;
}

interface IndexProps {
  resumeData: ResumeType;
}

const Index: React.FC<IndexProps> = ({ resumeData }) => {
  return <div>{JSON.stringify(resumeData)}</div>;
};

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
