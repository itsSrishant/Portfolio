import { Link, useLocation } from 'react-router-dom';
import type { AnchorHTMLAttributes } from 'react';

/**
 * A nav link that targets a `#section` on the homepage.
 *
 * On the homepage itself this renders a plain `<a href="#section">` —
 * unchanged from before routing existed, so the same-page smooth-scroll
 * behavior (Lenis intercepting the anchor click) keeps working exactly as
 * it did. Anywhere else, it becomes a router `Link` to `/#section`, and
 * `ScrollToHash` (mounted once in `App`) does the scroll once the
 * homepage has actually mounted — a plain `<a>` there would load `/` but
 * never scroll, since client-side navigation doesn't get the browser's
 * native hash-jump.
 */
export default function HashLink({
  hash,
  className,
  onClick,
  children,
  ...rest
}: {
  hash: string;
  className?: string;
  onClick?: () => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  if (onHome) {
    return (
      <a href={hash} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={`/${hash}`} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
