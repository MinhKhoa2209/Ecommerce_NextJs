export const metadata = {
  title: "Ecommerce App",
  description: "Manage your ecommerce store",
};
export default function RootLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <html lang="en">
        <body className="antialiased">
            {children}
        </body>
        </html>
    );
    }