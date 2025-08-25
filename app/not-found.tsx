"use client";

import Link from 'next/link';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Track 404 page view
    trackPageView('/404', 'Page Not Found');
    
    // Track 404 error event
    trackEvent('404_not_found', {
      page_url: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Illustration */}
        <div className="flex justify-center">
          <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-24 h-24 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div>
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Home
          </Link>
          <Link
            href="/brokers"
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Brokers
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Can't find what you're looking for? Try searching our site:
          </p>
          <Link
            href="/search"
            className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Brokers & Articles
          </Link>
        </div>

        {/* Report Broken Link */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Found a broken link? Help us improve by reporting it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-500 text-sm"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Report Broken Link
          </Link>
        </div>
      </div>
    </div>
  );
}