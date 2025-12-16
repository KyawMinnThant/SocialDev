import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t font-mono mt-10 py-10 text-sm text-gray-600">
      <div className="w-[92%] mx-auto px-5">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Logo & Info */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-gray-900">SocialDev</h2>
            <p className="text-gray-500 max-w-xs">
              Discover stories, thinking, and expertise from writers on any
              topic.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full md:w-auto">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-gray-800">Company</h3>
              <Link href="#" className="hover:text-black">
                About
              </Link>
              <Link href="#" className="hover:text-black">
                Careers
              </Link>
              <Link href="#" className="hover:text-black">
                Contact
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-gray-800">Resources</h3>
              <Link href="#" className="hover:text-black">
                Membership
              </Link>
              <Link href="#" className="hover:text-black">
                Write
              </Link>
              <Link href="#" className="hover:text-black">
                Help
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-gray-800">Legal</h3>
              <Link href="#" className="hover:text-black">
                Privacy
              </Link>
              <Link href="#" className="hover:text-black">
                Terms
              </Link>
              <Link href="#" className="hover:text-black">
                Policies
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-500">
          <p>© {new Date().getFullYear()} SocialDev — All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="#" className="hover:text-black">
              Twitter
            </Link>
            <Link href="#" className="hover:text-black">
              Instagram
            </Link>
            <Link href="#" className="hover:text-black">
              Github
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
