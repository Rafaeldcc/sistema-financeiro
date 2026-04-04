export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body style={{ background: "#0B0F1A", color: "white" }}>
        {children}
      </body>
    </html>
  );
}