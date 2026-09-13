import { BelamoreLogo } from "@/components/logo";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marble-surface flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-pedestal sm:p-10">
        <div className="mb-8 flex justify-center">
          <BelamoreLogo />
        </div>
        {children}
      </div>
    </div>
  );
}
