import Link from "next/link";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <Link href={href} className="btn w-full">
      {children}
    </Link>
  );
}
