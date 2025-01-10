import { Inter } from "next/font/google";
import '@/assets/styles/globals.css'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthWrapper from "@/components/AuthWrapper";
// we are making it in a seprate component instead of adding directy AuthProvide in the layout cuz then we need to  make the layout a client compnent that we don't want
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({subsets: ['latin']});

export const metadata = {
  title: "Bookit App | Book a Room",
  description: "Book a meeting or conference room for team",
};

export default function RootLayout({ children }) {
  return (
    <AuthWrapper>
    <html lang="en">
      <body
        className={inter.className}>
          <Header/>
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
        </main>
        <Footer/>
        <ToastContainer/>
      </body>
    </html>
    </AuthWrapper>
  );
}
