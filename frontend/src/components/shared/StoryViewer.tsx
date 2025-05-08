import { useEffect, useState } from "react";

type Story = {
  _id: string;
  mediaUrl: string;
  createdAt: string;
};

type UserStoryData = {
  user: {
    _id: string;
    username: string;
    fullname: string;
    avatar: {
      url: string;
    };
  };
  stories: Story[];
};

interface StoryViewerProps {
  storyData: UserStoryData[];
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ storyData, onClose }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentUser = storyData[currentUserIndex];
  const currentUserStories = currentUser?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];
  console.log(storyData);
  // Story progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1; // adjust speed here
      });
    }, 50); // 5 seconds total (100 * 50ms)

    return () => clearInterval(interval);
  }, [currentStoryIndex, currentUserIndex]);

  const handleNext = () => {
    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else if (currentUserIndex < storyData.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      // All stories done
      onClose?.();
    }
    setProgress(0);
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentUserIndex > 0) {
      const prevUser = storyData[currentUserIndex - 1];
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(prevUser.stories.length - 1);
    }
    setProgress(0);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Left tap area */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 flex justify-center ml-28 items-center"
        onClick={handlePrev}
      >
        <img
          src="/assets/icons/prev.svg"
          alt="prev icon button"
          className=" border-[1px] border-white rounded-full w-16 h-16 cursor-pointer"
        />
      </div>

      {/* Right tap area */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 flex justify-center mr-28  items-center"
        onClick={handleNext}
      >
        <img
          src="/assets/icons/next.svg"
          alt="next icon"
          className="border-[1px] border-white rounded-full w-16 h-16 cursor-pointer  "
        />
      </div>

      {/* Cancel Button */}
      <div className="absolute right-0 top-0 p-4" onClick={onClose}>
        <img
          src="/assets/icons/cancel.svg"
          alt="cancel icon button"
          className="border-[1px] border-white rounded-full w-12 h-12 cursor-pointer"
        />
      </div>

      <div className="w-[360px] max-w-full aspect-[9/16] bg-black rounded-xl overflow-hidden relative">
        {/* Progress bars */}
        <div className="absolute top-2 left-0 right-0 flex gap-1 px-4 shadow">
          {currentUserStories.map((__: unknown, idx: number) => (
            <div
              key={idx}
              className="h-1 flex-1 bg-white/40 rounded overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    idx < currentStoryIndex
                      ? "100%"
                      : idx === currentStoryIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Avatar and name */}
        <div className="absolute top-6 left-3 z-10 flex items-center gap-2 text-white">
          <img
            src={currentUser.user.avatar.url}
            alt={currentUser.user.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-base font-medium [text-shadow:_1px_1px_2px_black]">
            {currentUser.user.username}
          </span>
        </div>

        {/* Story media */}
        <img
          src={currentStory.mediaUrl}
          alt="story"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
export default StoryViewer;
