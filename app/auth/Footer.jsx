"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";

// Social Media Icons
const FacebookIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const LinkedInIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.509 0-4.543-2.034-4.543-4.543s2.034-4.543 4.543-4.543 4.543 2.034 4.543 4.543-2.034 4.543-4.543 4.543zm7.424-9.306c-.584 0-1.056-.472-1.056-1.056s.472-1.056 1.056-1.056 1.056.472 1.056 1.056-.472 1.056-1.056 1.056z" />
  </svg>
);

const YouTubeIcon = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const MailIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const MapPinIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);

  const footerLinks = {
    company: [
      { name: "About Us", href: "#" },
      // { name: "Careers", href: "#" },
      // { name: "Press", href: "#" },
      // { name: "Blog", href: "#" },
      // { name: "Contact", href: "#" },
    ],
    products: [
      // { name: "Features", href: "#" },
      // { name: "Pricing", href: "#" },
      // { name: "API", href: "#" },
      // { name: "Documentation", href: "#" },
      // { name: "Integrations", href: "#" },
    ],
    resources: [
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Webinars", href: "#" },
      { name: "Status", href: "#" },
    ],
    legal: [
      // { name: "Privacy Policy", href: "#" },
      // { name: "Terms of Service", href: "#" },
      // // { name: "Cookie Policy", href: "#" },
      // { name: "GDPR", href: "#" },
      // { name: "Disclaimer", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "#" },
    { name: "Twitter", icon: TwitterIcon, href: "#" },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      href: "https://www.linkedin.com/company/hireeva-ai",
    },
    { name: "Instagram", icon: InstagramIcon, href: "#" },
    { name: "YouTube", icon: YouTubeIcon, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h3 className="text-xl font-bold">Eva</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Interviewing made Simple, Quick and Easy.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MailIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">pallavi@stellehire.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">+1 (669) 204-6466</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Palo Alto, CA</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.name === "About Us") setIsAboutOpen(true);
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          {/* <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
          {/* 
          Resources Links
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Legal Links */}
          {/* <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Stay updated</h4>
              <p className="text-gray-400">
                Get the latest job opportunities and career insights delivered
                to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Eva. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <AboutUsDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
    </footer>
  );
};

export default Footer;

// About Us Dialog
const AboutUsDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-gray-900 text-white border-gray-800">
        {/* Hero */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-600/10 to-fuchsia-600/10" />
          <div className="px-6 py-10 sm:px-10 sm:py-12">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl sm:text-3xl font-extrabold">
                About HireEva
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-base">
                Interviewing made Quick and Easy - AI that scales your hiring
                without sacrificing quality.
                <br />
                <br />
                Eva helps teams hire faster and fairer by combining structured
                interviews, adaptive AI, and deeply human feedback loops. From
                sourcing to final decision, Eva turns hours into minutes while
                keeping candidates at the center.
                <br />
                <br />
                <br />
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Mission */}
        <section className="px-6 sm:px-10 pb-8">
          <h3 className="text-xl font-semibold mb-3">Our mission</h3>
          <p className="text-gray-300 leading-relaxed">
            We help teams hire faster and fairer by combining structured
            interviews, adaptive AI, and deeply human feedback loops. From
            sourcing to final decision, Eva turns hours into minutes while
            keeping candidates at the center.
          </p>
        </section>

        {/* Stats */}
        {/* <section className="px-6 sm:px-10 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat title="Faster hiring" value="7x" />
            <Stat title="Candidate CSAT" value="95%" />
            <Stat title="Bias reduction" value="-40%" />
            <Stat title="Interviews run" value=">250k" />
          </div>
        </section> */}

        {/* Values */}
        <section className="px-6 sm:px-10 pb-8">
          <h3 className="text-xl font-semibold mb-4">What we value</h3>
          <ul className="grid sm:grid-cols-2 gap-4">
            <ValueCard
              title="Fairness by design"
              desc="Structured, consistent, and explainable evaluations for every candidate."
            />
            <ValueCard
              title="Speed with signal"
              desc="Automations that save time while preserving the insights that matter."
            />
            <ValueCard
              title="Human in the loop"
              desc="Experts guide, calibrate, and approve - AI augments, never replaces humans."
            />
          </ul>
        </section>

        {/* Timeline */}

        {/* <section className="px-6 sm:px-10 pb-8">
          <h3 className="text-xl font-semibold mb-4">How we got here</h3>
          <ol className="relative border-l border-gray-800 pl-4 space-y-4">
            <TimelineItem
              year="2022"
              text="Founded to solve the slow, noisy interview pipeline."
            />
            <TimelineItem
              year="2023"
              text="Launched Eva Interviews with adaptive questioning and instant scoring."
            />
            <TimelineItem
              year="2024"
              text="Added transcripts, structured rubrics, and team calibration at scale."
            />
            <TimelineItem
              year="2025"
              text="Built company-wide insights and coaching, closing the loop from hire to ramp."
            />
          </ol>
        </section> */}

        <div className="px-6 sm:px-10 pb-6 flex justify-end">
          <DialogClose className="text-gray-300 hover:text-white">
            Close
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Stat = ({ title, value }) => (
  <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
    <div className="text-2xl font-extrabold">{value}</div>
    <div className="text-gray-400 text-sm">{title}</div>
  </div>
);

const ValueCard = ({ title, desc }) => (
  <li className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
    <div className="font-semibold mb-1">{title}</div>
    <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
  </li>
);

const TimelineItem = ({ year, text }) => (
  <li className="ml-2">
    <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
    <div className="text-sm text-gray-400">{year}</div>
    <div className="text-gray-200">{text}</div>
  </li>
);
