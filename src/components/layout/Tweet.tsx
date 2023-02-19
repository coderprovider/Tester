import {
  FaRetweet,
  FaRegCommentAlt,
  FaRegHeart,
  FaRegBookmark,
} from "react-icons/fa";
import {
  Card,
  Avatar,
  Button,
  TextInput,
  Dropdown,
  Spinner,
} from "flowbite-react";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import TweetComment from "./TweetComment";
import CommentBox from "./CommentBox";
import { useState } from "react";
import dynamic from "next/dynamic";
import { api, RouterOutputs } from "../../utils/api";
import { formatDate } from "../../utils/utilityFunctions";
import { BsThreeDots } from "react-icons/bs";
import { Session } from "next-auth";
import { toast } from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import useDeleteTweet from "../../hooks/tweet/useDeleteTweet";

const CommentModal = dynamic(() => import("../home/CommentModal"), {
  ssr: false,
});

interface TweetProps {
  tweet: RouterOutputs["tweet"]["getTweets"][number];
  userSession: Session | null;
  queryClient: QueryClient;
}

export default function Tweet({ tweet, userSession, queryClient }: TweetProps) {
  const [toggleModal, setToggleModal] = useState<boolean>(false);

  // ! delete tweet mutation
  const { mutate: deleteTweet, isLoading: tweetDeleteLoading } = useDeleteTweet(
    { queryClient }
  );

  // ! delete tweet function
  function tweetDelete() {
    deleteTweet({ tweetID: tweet.id, imageID: tweet.imageID ?? undefined });
  }

  return (
    <li className="w-full">
      <h2 className="mb-2 flex items-center gap-2.5 text-gray-400">
        <FaRetweet className="text-lg" />
        <span className="text-sm">Daniel Jensen Retweeted</span>
      </h2>

      <article className="max-w-full">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                img={
                  tweet.user.image ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
              />
              <div>
                <h3 className="text-base font-bold capitalize text-black">
                  {tweet.user.name}
                </h3>
                <time
                  dateTime={tweet.createdAt as unknown as string}
                  className="text-xs font-medium text-gray-400"
                >
                  {formatDate(tweet.createdAt)}
                </time>
              </div>
            </div>

            {userSession?.user.id === tweet.user.id && (
              <Dropdown
                label={<BsThreeDots />}
                dismissOnClick={false}
                arrowIcon={false}
                inline={true}
                className={
                  tweetDeleteLoading
                    ? "pointer-events-none"
                    : "pointer-events-auto"
                }
              >
                <Dropdown.Item onClick={tweetDelete}>
                  {tweetDeleteLoading ? (
                    <Spinner aria-label="Default status example" />
                  ) : (
                    "Delete"
                  )}
                </Dropdown.Item>
              </Dropdown>
            )}
          </div>

          <p className="text-base font-medium text-gray-600">{tweet.text}</p>

          {tweet.image && (
            <figure className="relative h-60 w-full sm:h-80">
              <Image
                src={tweet.image}
                alt="tweet cover"
                className="object-contain"
                fill={true}
              />
            </figure>
          )}

          <div className="flex items-center justify-end space-x-4 border-0 border-b-2 border-solid border-gray-100 pb-1 text-xs font-medium text-gray-400">
            <span>{tweet._count.comments} Comments</span>
            <span>{tweet._count.retweets} Retweets</span>
            <span>{tweet._count.Bookmark} Saved</span>
            <span>{tweet._count.likes} Liked</span>
          </div>

          <Button.Group className="flex flex-wrap justify-between border-0 border-b-2 border-solid border-gray-100 pb-3">
            <Button
              color="gray"
              className="flex-1"
              onClick={() => setToggleModal(true)}
            >
              <FaRegCommentAlt className="mr-3 text-xl" />
              <span className="hidden sm:block">Comments</span>
            </Button>
            <Button
              color="gray"
              className={`flex-1 ${
                tweet.retweets.length === 1 && "text-green-500"
              }`}
            >
              <FaRetweet className="mr-3 text-xl" />
              <span className="hidden sm:block">Retweets</span>
            </Button>
            <Button
              color="gray"
              className={`flex-1 ${tweet.likes.length === 1 && "text-red-500"}`}
            >
              <FaRegHeart className="mr-3 text-xl" />
              <span className="hidden sm:block">Like</span>
            </Button>
            <Button
              color="gray"
              className={`flex-1 ${
                tweet.Bookmark.length === 1 && "text-blue-500"
              }`}
            >
              <FaRegBookmark className="mr-3 text-xl" />
              <span className="hidden sm:block">Bookmark</span>
            </Button>
          </Button.Group>

          <CommentModal
            toggleModal={toggleModal}
            setToggleModal={setToggleModal}
          />
        </Card>
      </article>
    </li>
  );
}
