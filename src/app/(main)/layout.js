import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "One portal",
  description: "One portal",
};

export default function RootLayout({ children }) {
  return (
    <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* <Navbar /> */}
      <main className="relative mx-auto bg-[#f8f9fb] min-h-screen">
        <Toaster position="top-center" />
        {/* Fixed sidebar rendered here; content uses left margin to avoid overlap */}
        {/* <SideBar /> */}
        <div className="ml-[300px] bg-[#f8f9fb] h-screen overflow-auto p-2">
          {children}
        </div>
      </main>
    </main>
  );
}
