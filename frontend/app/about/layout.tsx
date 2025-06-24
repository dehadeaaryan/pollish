export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 overflow-hidden">
      <div className="inline-block max-w-lg text-center justify-center overflow-hidden">
        {children}
      </div>
    </section>
  );
}
