import React from "react";
import Link from "next/link";
import { PostMeta } from "~/lib/posts";

const PostSummary: React.FC<PostMeta> = ({ title, id, description }) => {
  return (
    <Link href={id}>
      <a>
        <div>
          <h3>{title}</h3>
          {description && <h4>{description}</h4>}
          <p>{description}</p>
        </div>
      </a>
    </Link>
  );
};

export default PostSummary;
