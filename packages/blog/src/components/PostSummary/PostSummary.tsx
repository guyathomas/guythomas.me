import React from "react";
import Link from "next/link";
import { PostMeta } from "~/lib/posts";

const PostSummary: React.FC<PostMeta> = ({ title, id, description }) => {
  return (
    <Link href={"/blog" + id}>
      <a>
        <div>
          <h3>{title}</h3>
          {description && <h4>{description}</h4>}
        </div>
      </a>
    </Link>
  );
};

export default PostSummary;
