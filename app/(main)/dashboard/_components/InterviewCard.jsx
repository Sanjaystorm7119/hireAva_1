"use client";
import React from "react";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "../../../../components/ui/3d-card";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
// function InterviewCard({ interview }) {
//   return <div>interviewCard</div>;
// }

// export default InterviewCard;

function InterviewCard({ interview, viewDetail = false }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interviewId;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast("Copied");
  };
  const { user } = useUser();
  const onSend = () => {
    window.location.href = `mailto:${user.emailAddresses[0]?.emailAddress}?subject=hireEva Interview Link&body=InterviewLink: ${url}`;
  };

  return (
    <CardContainer className="inter-var  ">
      {/* className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14" */}
      <CardBody className="bg-gray-50 isolation: isolate relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] sm:w-[20rem] h-auto rounded-xl p-4 border  ">
        <div>
          <CardItem
            translateZ="50"
            className="text-lg font-bold text-neutral-600 dark:text-white"
          >
            <h2>{moment(interview?.created_at).format("MMM DD, YYYY")}</h2>
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            {/* {user.firstName} */}
            {interview?.jobPosition} - {interview?.duration} Mins
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            <span>{interview["interview_feedback"]?.length} candidates</span>
          </CardItem>

          <CardItem
            translateZ="100"
            rotateX={20}
            rotateZ={-10}
            className="w-full mt-2"
          >
            <img
              // src={user.imageUrl}
              src={"/interviews_image.jpg"}
              height="1000"
              width="1000"
              className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          {!viewDetail ? (
            <div className="flex justify-between items-center mt-8">
              {!viewDetail && (
                <CardItem
                  translateZ={20}
                  translateX={-40}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  onClick={copyLink}
                >
                  Copy Link →
                </CardItem>
              )}

              <CardItem
                translateZ={20}
                translateX={40}
                as="button"
                className="px-4 py-2 rounded-xl flex justify-center items-center bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                onClick={onSend}
              >
                <Send />
                Send
              </CardItem>
            </div>
          ) : (
            <Link
              href={
                "/scheduled-interview/" + interview?.interviewId + "/details"
              }
            >
              <Button className='absolute mt-5 w-full variant="outline"'>
                View
              </Button>
            </Link>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
}
export default InterviewCard;
