export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-black dark:to-cyan-900/20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-bounce delay-1000"></div>

      <div className="text-center relative z-10 flex flex-col items-center justify-center">
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-20 h-20 border-4 border-cyan-200/50 rounded-full animate-spin"></div>

          {/* Middle Ring */}
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animation-delay-200 absolute top-2 left-2"></div>

          {/* Inner Ring */}
          <div className="w-12 h-12 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-500 absolute top-4 left-4"></div>

          {/* Center Dot */}
          <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full absolute top-8 left-8 animate-pulse"></div>

        {/* Loading Text */}
        <div className="mt-8 space-y-2">
          <p className="text-gray-600 dark:text-gray-400 sm:text-xl md:text-2xl lg:text-3xl font-medium text-lg animate-pulse">
            Loading Portfolio...
          </p>
        </div>
        </div>


      </div>
    </div>

  );
}