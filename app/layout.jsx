import "./globals.css";
import AuthProvider from "../components/auth/AuthProvider";

export const metadata = {
  title: "Amortízate",
  description: "Simulación y cálculo de amortización de créditos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
