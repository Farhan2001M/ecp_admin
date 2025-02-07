"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Hello world</h1>
    </div>
  );
}
