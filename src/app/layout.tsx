import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PV-Netzanschlussvergleich',
  description: 'Engineering-Tool zum Vergleich von NS- vs. MS-PV-Netzanschlüssen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
