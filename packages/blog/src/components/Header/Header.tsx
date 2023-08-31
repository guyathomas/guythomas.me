import React from "react";
import Link from "next/link";
import cx from "classnames";
import MenuButton from "~/components/MenuButton";
import styles from "./Header.module.css";

interface Link {
  name: string;
  path: string;
}

const links: Link[] = [
  {
    name: "Resume",
    path: "https://resume.guythomas.me",
  },
];

const Header: React.FC<React.PropsWithChildren> = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={cx(styles.header, "bg-blue-300", "p-4")}>
      <div className={cx(styles.headerContent)}>
        <div className={styles.headerLinks}>
          <Link href="/">
            <h3 className={styles.siteTitle}>Guy</h3>
          </Link>
          <div
            className={cx(
              styles.linkContainer,
              isExpanded && styles.linkContainerMobileExpanded,
            )}
          >
            <ul className={styles.navigationLinks}>
              {links.map(({ name, path }, i) => (
                <li
                  className={cx(
                    "p-2",
                    styles.navLink,
                    isExpanded && styles.navLinkExpanded,
                  )}
                  style={{ "--animation-order": i } as any}
                  key={`${name}:${path}`}
                >
                  <Link key={name} href={path}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.menuButton}>
          <MenuButton
            toggleIsExpanded={() => {
              setIsExpanded(!isExpanded);
            }}
            isExpanded={isExpanded}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
