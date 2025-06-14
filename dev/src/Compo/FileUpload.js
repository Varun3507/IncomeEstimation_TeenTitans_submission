'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus('Please select a CSV file.');
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setStatus('Please upload only CSV files.🚫');
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

  return (
    <form
      onSubmit={handleUpload}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4 animate-fade-in"
    >
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
      >
        Upload CSV
      </button>

      {status && <p className="text-center text-gray-700">{status}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mt-4 animate-fade-in-up">
          <h3 className="font-bold mb-2">Prediction Result</h3>
          <pre className="whitespace-pre-wrap break-words text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
