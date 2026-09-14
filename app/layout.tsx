import "./globals.css";
import Tawk from "./components/Tawk";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Tawk />
      </body>
    </html>
  );
}
