import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FFF] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-full md:w-1/2">
            {/* Light Bulb SVG */}
            <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 10 L50 30"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M35 40 C35 20 65 20 65 40 C65 55 55 60 55 70 L45 70 C45 60 35 55 35 40"
                fill="#FFE4B5"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            
            {/* Blob Characters SVG */}
            <svg className="w-64 h-32 mx-auto mt-8" viewBox="0 0 200 100" fill="none">
              <path
                d="M40 50 C20 50 20 80 40 80 C60 80 60 50 40 50"
                fill="#FF6B6B"
              />
              <path
                d="M90 60 C70 60 70 90 90 90 C110 90 110 60 90 60"
                fill="#845EC2"
              />
              <path
                d="M140 55 C120 55 120 85 140 85 C160 85 160 55 140 55"
                fill="#FF9671"
              />
              <circle
                cx="180"
                cy="75"
                r="5"
                fill="#4FFBDF"
              />
            </svg>
          </div>
          
          <div className="text-left md:w-1/2">
            <p className="text-sm text-gray-600 mb-2">
              Error 404
            </p>
            
            <h1 className="text-4xl font-bold mb-4">
              there is light in here too.
            </h1>
            
            <p className="text-gray-600 mb-8">
              But the page is missing or you assembled the link incorrectly.
            </p>
            
            <a
              href="/"
              className="inline-flex items-center text-black hover:text-gray-700 transition-colors"
            >
              Go home
              <svg
                className="ml-2 w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;



