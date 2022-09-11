import React from "react";
import Link from "next/link";
import { PostMeta } from "~/lib/posts";

const PostSummary: React.FC<PostMeta> = ({ title, id, description }) => {
  return (
    <Link href={"/blog" + id}>
      <a className="no-underline">
        <div>
          <h3 className="">{title}</h3>
          {description && (
            <h4 className="font-normal text-slate-700">{description}</h4>
          )}
        </div>
      </a>
    </Link>
  );
};

export default PostSummary;
