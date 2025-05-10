"use client";

import { useRef, useState, useEffect } from "react";
import { HandThumbUpIcon, HandThumbDownIcon, HeartIcon, ChatBubbleLeftIcon, ShareIcon, DocumentTextIcon, FlagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useToggleLikeMutation, useGetLikesQuery, useAddViewMutation, useGetCommentsQuery, useCreateCommentMutation ,  useToggleLikeDislikeMutation , useGetDislikesQuery } from "../store/api/interactionApi";
import { toast } from "react-hot-toast";

interface VideoPlayerProps {
  data: any;
}

export default function VideoPlayer({ data }: VideoPlayerProps) {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);
  const [localDislikesCount, setLocalDislikesCount] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localCommentsCount, setLocalCommentsCount] = useState(0);
  const [showCommentsList, setShowCommentsList] = useState(false);

  // Interaction API hooks
  const [toggleLikeDislike] = useToggleLikeDislikeMutation();
  const { data: likesData, refetch: refetchLikes } = useGetLikesQuery(data?._id);
  const { data: dislikesData, refetch: refetchDislikes } = useGetDislikesQuery(data?._id);
  const [addView] = useAddViewMutation();
  const { data: commentsData, refetch: refetchComments } = useGetCommentsQuery(data?._id);
  const [createComment] = useCreateCommentMutation();

  // Initialize likes count from API data
  useEffect(() => {
    setLocalLikesCount(likesData?.count || 0);
    setIsLiked(likesData?.likedByCurrentUser || false);
  }, [likesData]);

  useEffect(() => {
    setLocalDislikesCount(dislikesData?.count || 0);
    setIsDisliked(dislikesData?.dislikedByCurrentUser || false);
  }, [dislikesData]);

  // Initialize comments count
  useEffect(() => {
    if (commentsData?.length !== undefined) {
      setLocalCommentsCount(commentsData.length);
    } else if (data?.stats?.comments !== undefined) {
      setLocalCommentsCount(data.stats.comments);
    }
  }, [commentsData?.length, data?.stats?.comments]);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    try {
      if (!commentText.trim() || !data?._id) return;

      setLocalCommentsCount(prev => prev + 1);

      await createComment({
        videoId: data._id,
        text: commentText.trim()
      }).unwrap();

      // Refetch comments after posting
      refetchComments();

      setCommentText("");
      setShowCommentModal(false);
      toast.success('Comment posted successfully');
    } catch (error) {
      setLocalCommentsCount(prev => prev - 1);
      toast.error('Failed to post comment');
    }
  };

  // Handle like/dislike
  const handleLike = async () => {
    if (!data?._id) return;
    try {
      await toggleLikeDislike({ videoId: data._id, isLiked: true }).unwrap();
      refetchLikes();
      refetchDislikes();
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleDislike = async () => {
    if (!data?._id) return;
    try {
      await toggleLikeDislike({ videoId: data._id, isLiked: false }).unwrap();
      refetchLikes();
      refetchDislikes();
    } catch (error) {
      toast.error("Failed to update dislike");
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.title,
          text: `Check out this video: ${data?.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share video');
    }
  };

  // Add view when video is loaded
  const handleVideoLoad = () => {
    if (data?._id) {
      addView(data._id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            ref={videoRef}
            // src="https://iframe.mediadelivery.net/embed/410732/dec63cd9-c5d6-4e6a-8dbd-a7c618341ce5?token=0dbf2518b5fbfd57c22c95769ec4fb7bd524c9a29343f8903629a053ec0c9f66&expires=1745475869&autoplay=true&loop=false&muted=false&preload=true&responsive=true"
            src={data.src}
            loading="lazy"
            style={{ border: "0", position: "absolute", top: "0", height: "100%", width: "100%" }}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
            allowFullScreen={true}
            onLoad={handleVideoLoad}
          />
        </div>
      </div>

      {/* Video Interaction Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Like/Dislike */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 ${isLiked ? 'bg-red-500' : 'bg-[#1a1f25] hover:bg-[#252b33]'} px-4 py-2 rounded-l-full`}
          >
            <HandThumbUpIcon className="w-6 h-6" />
            <span>{localLikesCount}</span>
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 ${isDisliked ? 'bg-blue-500' : 'bg-[#1a1f25] hover:bg-[#252b33]'} px-4 py-2 rounded-r-full`}
          >
            <HandThumbDownIcon className="w-6 h-6" />
            <span>{localDislikesCount}</span>
          </button>
        </div>

        {/* Favorite */}
        {/* <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <HeartIcon className="w-6 h-6" />
          <span className="text-[15px]">Favorite</span>
        </button> */}

        {/* Comments */}
        <button 
          onClick={() => setShowCommentModal(true)}
          className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full"
        >
          <ChatBubbleLeftIcon className="w-6 h-6" />
          <span className="text-[15px]">{localCommentsCount}</span>
        </button>

        {/* Show Comments Button */}
        <button
          onClick={() => setShowCommentsList(true)}
          className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full"
        >
          Show Comments
        </button>

        {/* Share */}
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full"
        >
          <ShareIcon className="w-6 h-6" />
          <span className="text-[15px]">Share</span>
        </button>

        <div className="h-6 w-px bg-gray-700 mx-2" />

        {/* About */}
        {/* <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <DocumentTextIcon className="w-6 h-6" />
          <span className="text-[15px]">About</span>
        </button> */}

        {/* Flag */}
        {/* <button className="flex items-center gap-2 bg-[#1a1f25] hover:bg-[#252b33] px-4 py-2 rounded-full">
          <FlagIcon className="w-6 h-6" />
        </button> */}
        {data?.title}
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1f25] rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Comments</h3>
              <button 
                onClick={() => setShowCommentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Comment Input */}
            <div className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-[#252b33] text-white rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            

            {/* Post Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                className={`px-4 py-2 rounded-lg ${
                  commentText.trim()
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Comments Modal */}
      {showCommentsList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1f25] rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">All Comments</h3>
              <button 
                onClick={() => setShowCommentsList(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {commentsData?.length ? commentsData.map((comment) => (
                <div key={comment._id} className="bg-[#252b33] rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    {/* <span className="text-white font-medium">{comment.userId || 'Anonymous'}</span> */}
                    <span className="text-gray-400 text-sm">
                      {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString('en-US') : ''}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              )) : <p className="text-gray-400">No comments yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
