export const metadata = {
  title: "Send confession",
  description: "Confess - Share your secrets anonymously.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
