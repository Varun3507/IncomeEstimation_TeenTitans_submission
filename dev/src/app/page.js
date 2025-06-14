import FileUpload from '@/components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50/20 to-accent-50/20 dark:from-neutral-900 dark:via-primary-900/10 dark:to-accent-900/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold  text-neutral-600 dark:text-neutral-100 animate-fade-in-up">
               Income Estimation
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto animate-fade-in-up delay-75">
              Upload your CSV file and let our AI model predict income levels with precision.
            </p>
          </div>

          {/* Upload Section */}
          <div className="max-w-md mx-auto">
            <FileUpload />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
              <div className="text-3xl mb-4 text-center">🎯</div>
              <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mb-2 text-center">Accurate</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center">High-precision ML model trained on extensive financial data.</p>
            </div>
            <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-100">
              <div className="text-3xl mb-4 text-center">🔒</div>
              <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mb-2 text-center">Secure</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center">Your data is processed securely and never stored.</p>
            </div>
            <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-200">
              <div className="text-3xl mb-4 text-center">⚡</div>
              <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mb-2 text-center">Fast</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center">Get instant predictions with our optimized pipeline.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
