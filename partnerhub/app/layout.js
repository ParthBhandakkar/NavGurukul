import './globals.css';

export const metadata = {
  title: 'PartnerHub — NavGurukul Partnership CRM',
  description: 'A lightweight CRM tool for managing NavGurukul partnerships with NGOs, government bodies, corporates, and placement partners.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
