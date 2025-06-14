// 'use client';

// import { useState } from 'react';

// export default function FileUpload() {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState('');
//   const [result, setResult] = useState(null);
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return setStatus('Please select a CSV file.');
    
//     // Validate file type
//     if (!file.name.toLowerCase().endsWith('.csv')) {
//       setStatus('Please upload only CSV files.🚫');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     setStatus('Uploading...');
//     setResult(null);

//     try {
//       const res = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setStatus('Upload successful ✅');
//         setResult(data.prediction || data.result);
//       } else {
//         setStatus(`Upload failed ❌: ${data.error || 'Unknown error'}`);
//       }
//     } catch (error) {
//       console.error(error);
//       setStatus('Upload failed ❌');
//     }
//   };

//   return (
//     <form
//       onSubmit={handleUpload}
//       className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4 animate-fade-in"
//     >
//       <input
//         type="file"
//         accept=".csv"
//         onChange={(e) => setFile(e.target.files[0])}
//         className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
//       />
//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
//       >
//         Upload CSV
//       </button>

//       {status && <p className="text-center text-gray-700">{status}</p>}

//       {result && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mt-4 animate-fade-in-up">
//           <h3 className="font-bold mb-2">Prediction Result</h3>
//           <pre className="whitespace-pre-wrap break-words text-sm">{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </form>
//   );
// }


'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus('Please select a CSV file.');
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setStatus('Please upload only CSV files 🚫');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setStatus('Uploading...');
    setResult(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('Upload successful ✅');
        setResult(data.prediction || data.result);
      } else {
        setStatus(`Upload failed ❌: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('Upload failed ❌');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith('.csv')) {
      setFile(droppedFile);
    } else {
      setStatus('Please upload only CSV files 🚫');
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="w-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6 animate-fade-in-up border border-neutral-200/50 dark:border-neutral-700/50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' 
            : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500'
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Choose a CSV file or drag it here"
        />
        <div className="space-y-4 pointer-events-none">
          <div className="text-5xl animate-bounce">📊</div>
          <p className="text-neutral-600 dark:text-neutral-400">
            {file ? file.name : 'Drop your CSV file here or click to browse'}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!file}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-gray-600 cursor-pointer font-semibold py-3 px-6 rounded-xl shadow-sm hover:from-primary-700 hover:to-primary-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed animate-scale-in"
      >
        {file ? 'Upload CSV' : 'Select a File'}
      </button>

      {status && (
        <div className={`text-center p-4 rounded-lg animate-fade-in ${
          status.includes('✅') 
            ? 'bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
            : status.includes('❌') 
              ? 'bg-red-50/50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              : 'bg-neutral-50/50 dark:bg-neutral-900/20 text-neutral-700 dark:text-neutral-400'
        }`}>
          {status}
        </div>
      )}

      {result && (
        <div className="bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl p-6 animate-fade-in-up">
          <h3 className="font-bold mb-2 text-green-700 dark:text-green-400">Prediction Result</h3>
          <pre className="whitespace-pre-wrap break-words text-sm text-neutral-800 dark:text-neutral-200 bg-white/50 dark:bg-black/50 p-4 rounded-lg">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}
