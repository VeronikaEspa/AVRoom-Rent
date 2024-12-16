import React from "react";
import TopBar from "@/app/components/Sidebar/TopBar";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (      
    <div>
      <TopBar />
      <div>
        <section className="mt-[60px] mb-[20px] mx-[20px] bg-whiteColor p-4 rounded">
          {children}
        </section>
      </div>
    </div>
  );
}