import React from "react";
import Image from "next/image";
function InterviewHeader() {
  return (
    <div>
      <Image
        className="h-[70px] w-[70px]"
        src={"../Ava_icon_32.svg"}
        width={70}
        height={70}
        alt="Ava_icon_32"
      />
    </div>
  );
}

export default InterviewHeader;
