import Link from "next/link";

export function PatientHeader() {
  return (
    <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-4.5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-terracotta text-base font-extrabold text-white">
          A
        </div>
        <span className="text-[19px] font-extrabold tracking-[-0.3px]">
          Alivia
        </span>
      </div>
      <Link
        href="/login"
        className="rounded-full border border-input-border bg-white px-4 py-2 text-sm font-semibold text-ink no-underline"
      >
        Ingresar
      </Link>
    </div>
  );
}
