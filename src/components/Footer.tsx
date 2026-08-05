import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="border-line-soft border-t py-10">
      <div className="shell flex flex-wrap items-center justify-between gap-4">
        <p className="text-ink-3 text-[0.8125rem]">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
