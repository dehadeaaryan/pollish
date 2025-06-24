export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center w-full h-full">
      <div className="max-w-lg w-full h-full flex justify-center items-center">
        {children}
      </div>
    </section>
  );
}
