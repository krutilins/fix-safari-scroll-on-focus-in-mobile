import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/telegram">Telegram</Link>
      </li>
      <li>
        <Link href="/linkedin">LinkedIn</Link>
      </li>
    </ul>
  );
}
