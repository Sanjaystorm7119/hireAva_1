import React from "react";
import Image from "next/image";
import Link from "next/link";

function InterviewHeader() {
  return (
    <div>
      <Link href={"/dashboard"}>
        <Image
          className="h-[70px] w-[70px]"
          src="/Ava_icon_32.svg"
          width={70}
          height={70}
          alt="Ava icon"
          priority
        />
      </Link>
    </div>
  );
}

export default InterviewHeader;
