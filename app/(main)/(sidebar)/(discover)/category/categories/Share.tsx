import React, { memo, useEffect, useCallback } from "react";
import styles from "../../../../styles/aside/discover/categories/photography/Share.module.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { SelectedShareState } from "../../../../types/aside/discover/categories/Interface";
import { showToast } from "../../../../util/Toast";

interface CategoriesShareProps {
  shareState: SelectedShareState;
}

export const CategoriesShare = memo(({ shareState }: CategoriesShareProps) => {
  const handleAction = useCallback((e: any, actionType: string) => {
    switch (actionType) {
      case "copyUrl": {
        const { value } = e.currentTarget;
        navigator.clipboard.writeText(value);
        showToast({ type: "link", fallback: "Copy Link Success" });
        break;
      }
    }
  }, []);

  return (
    <div className={styles.shareContainer}>
      <h2 className={styles.title}>Share</h2>
      <div className={styles.socialIcons}>
        {[
          {
            href: "https://facebook.com",
            icon: <FaFacebook />,
            name: "Facebook",
          },
          {
            href: "https://instagram.com",
            icon: <FaInstagram />,
            name: "Instagram",
          },
          {
            href: "https://twitter.com",
            icon: <FaXTwitter />,
            name: "Twitter",
          },
          { href: "https://tiktok.com", icon: <FaTiktok />, name: "Tiktok" },
          {
            href: "https://linkedin.com",
            icon: <FaLinkedin />,
            name: "LinkedIn",
          },
        ].map(({ href, icon, name }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            title={name}
          >
            {icon}
          </a>
        ))}
      </div>
      <div className={styles.shareActions}>
        <button
          className={styles.copyButton}
          value={shareState?.imageUrl}
          onClick={(e) => handleAction(e, "copyUrl")}
        >
          <FaLink />
        </button>
        <p className={styles.copyUrl}>
          {shareState?.imageUrl?.length > 30
            ? shareState.imageUrl.slice(0, 30) + "..."
            : shareState?.imageUrl}
        </p>
      </div>
    </div>
  );
});
