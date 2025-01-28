import React from "react";
import { QuoteBoxProps } from "@/types/quotes"; // Import the QuoteBoxProps (includes Quote interface)

const Quotes: React.FC<QuoteBoxProps> = ({ quotes }) => {
  return (
    <>
      <main className="flex flex-col">
        <h2 className="text-xl font-bold mb-4">Quotes</h2>
        <div className="w-full max-w-6xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="space-y-4">
                {quotes.map((quote, index) => (
                <div
                    key={index}
                    className="p-4 border-l-4 border-orange-500 bg-gray-50 rounded-md"
                >
                    <p className="text-lg italic">{quote.text}</p>
                    <span className="block text-sm text-right text-gray-500 mt-2">
                    - {quote.author}
                    </span>
                </div>
                ))}
            </div>
            </div>        
      </main>

    </>
  );
};

export default Quotes;
