"use client";

import { UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Footer from "../auth/Footer";
import Image from "next/image";
import LiquidChrome from '../../components/ui/LiquidChrome';

const Login = () => {
  return (
    <div className="relative flex flex-col">
      <Navbar />
      
      {/* LiquidChrome background - moved to proper location */}
      <div style={{ width: '100%', height: '50%', position: 'absolute', top: 0, zIndex: 0 }}>
        <LiquidChrome
          baseColor={[0.4, 0.1, 1.0]}
          speed={0.3}
          amplitude={0.3}
          interactive={true}
        />
      </div>

      {/* Border decorations */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 px-4 py-10 md:py-20">
        <h1 className="mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Get Interviewed Quick".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mx-auto max-w-xl py-4 text-center text-lg font-normal text-white"
        >
          With Eva, you can now interview anytime anywhere
        </motion.p>
        
        <Link href="/dashboard">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Explore Now
            </button>
          </motion.div>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
};

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="relative z-20 flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Image
          src="/evaSvg.svg"
          width={40}
          height={40}
          alt="eva_icon_32"
          className="h-10 w-10 rounded-full"
        />
        <h1 className="text-base font-bold md:text-2xl">HireEva</h1>
      </div>
      {!user ? (
        <Link href="./sign-in">
          <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex gap-5">
          <Link href="./dashboard">
            <button className="transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Dashboard
            </button>
          </Link>
          <UserButton />
        </div>
      )}
    </nav>
  );
};

export default Login;