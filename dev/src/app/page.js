import FileUpload from '@/components/FileUpload';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50  p-6">
      <h1 className="text-4xl font-bold text-center mb-2 animate-fade-in-up">Upload CSV for Prediction</h1>
      <p className="text-gray-600 mb-6 text-center max-w-xl animate-fade-in-up delay-75">
        Upload your CSV file and let our model do the magic.
      </p>
      <FileUpload />
    </main>
  );
}
