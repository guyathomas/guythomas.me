import React from "react";
import Link from "next/link";
import cx from "classnames";
import MenuButton from "~/components/MenuButton";
import styles from "./Header.module.css";

interface Link {
  name: string;
  path: string;
}

const links: Link[] = [{ name: "Home", path: "/" }];

const Header: React.FC<React.PropsWithChildren> = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={cx(styles.header, "bg-blue-300")}>
      <div className={styles.headerLinks}>
        <h3 className={styles.siteTitle}>Guy</h3>
        <div
          className={cx(
            styles.linkContainer,
            isExpanded && styles.linkContainerMobileExpanded
          )}
        >
          <ul className={styles.navigationLinks}>
            {links.map(({ name, path }, i) => (
              <li
                className={cx(
                  "p-2",
                  "prose-xl",
                  styles.navLink,
                  isExpanded && styles.navLinkExpanded
                )}
                style={{ "--animation-order": i } as any}
              >
                <Link key={name} href={path}>
                  <a>{name}</a>
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
  );
};

export default Header;
