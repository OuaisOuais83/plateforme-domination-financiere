import './globals.css'

export const metadata = {
  title: 'Domination Financière',
  description: 'Plateforme transactionnelle de domination financière',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
