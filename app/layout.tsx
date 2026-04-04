export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-[#0B0F1A] text-white">
        {children}
      </body>
    </html>
  );
}