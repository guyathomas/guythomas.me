import React from "react";
import Link from "next/link";
import { DeviceContext } from "~/context/DeviceContext";

interface Link {
  name: string;
  path: string;
}

const links: Link[] = [
  { name: "Home", path: "/" },
  { name: "Resume", path: "/resume" },
  { name: "Blog", path: "/blog" },
];

const Sidebar: React.FC<React.PropsWithChildren> = () => {
  const result = React.useContext(DeviceContext);
  return result?.isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};

const MobileSidebar: React.FC = () => {
  return (
    <ul className="absolute bg-white h-screen w-screen flex flex-col justify-center align-middle pl-8 pr-8 text-center">
      {links.map(({ name, path }) => (
        <Link href={path}>
          <ul className="mb-2 last:mb-0" key={path}>
            {name}
          </ul>
        </Link>
      ))}
    </ul>
  );
};
const DesktopSidebar: React.FC = () => {
  return (
    <ul className="bg-white flex flex-col justify-center align-middle pl-8 pr-8">
      {links.map(({ name, path }) => (
        <ul className="mb-2 last:mb-0" key={path}>
          {name}
        </ul>
      ))}
    </ul>
  );
};

export default Sidebar;
