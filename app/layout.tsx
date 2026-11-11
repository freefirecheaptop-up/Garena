import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Free Fire Diamond Top-Up Store | Instant UID Recharge (50% OFF)',
  description: 'Official-style premium Free Fire Diamond top-up portal with instant player UID delivery, 50% discount on all diamond packages, and secure Rupayex checkout.',
  openGraph: {
    title: 'Free Fire Diamond Top-Up Store | Instant UID Recharge (50% OFF)',
    description: 'Official-style premium Free Fire Diamond top-up portal with instant player UID delivery, 50% discount on all diamond packages, and secure Rupayex checkout.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fire Diamond Top-Up Store | Instant UID Recharge (50% OFF)',
    description: 'Official-style premium Free Fire Diamond top-up portal with instant player UID delivery, 50% discount on all diamond packages, and secure Rupayex checkout.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
