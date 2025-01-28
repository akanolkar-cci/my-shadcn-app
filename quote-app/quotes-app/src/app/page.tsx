
import Quotes from "@/app/quotes/page";
import Header from "@/components/Header";
import { Quote } from "@/types/quotes"; 


export default function Home() {
  const quotes: Quote[] = [
    { text: "Learn as if you will live forever, live like you will die tomorrow.", author: "Mahatma Gandhi" },
    { text: "It’s fine to celebrate success but it is more important to heed the lessons of failure.", author: "Bill Gates" },
    { text: "Be faithful in small things because it is in them that your strength lies.", author: "Mother Teresa" },
  ];

  return (
    <>
      <Header />
       <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Quotes quotes={quotes} />
      </main>
    </>
  );
}
