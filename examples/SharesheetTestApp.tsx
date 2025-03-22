import React, { useState, useRef } from 'react';
import { shareText, shareFile, shareBlob } from '@buildyourwebapp/tauri-plugin-sharesheet';

function SharesheetTestApp() {
  const [status, setStatus] = useState<string>('');
  const [text, setText] = useState<string>('Hello from Tauri Sharesheet plugin!');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleShareText = async () => {
    try {
      await shareText(text, { title: 'Shared Text' });
      setStatus('Text shared successfully');
    } catch (error) {
      setStatus(`Error sharing text: ${error}`);
      console.error(error);
    }
  };

  const handleShareFile = async () => {
    if (!fileInputRef.current?.files?.length) {
      setStatus('Please select a file first');
      return;
    }

    try {
      const file = fileInputRef.current.files[0];
      await shareBlob(file, file.name, { 
        mimeType: file.type,
        title: 'Shared File' 
      });
      setStatus(`File "${file.name}" shared successfully`);
    } catch (error) {
      setStatus(`Error sharing file: ${error}`);
      console.error(error);
    }
  };

  const handleDrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple shape
    ctx.fillStyle = '#4287f5';
    ctx.fillRect(10, 10, 180, 100);
    
    ctx.fillStyle = '#f54242';
    ctx.beginPath();
    ctx.arc(100, 60, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Tauri Share', 60, 65);
  };

  const handleShareCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setStatus('Canvas not available');
      return;
    }
    
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });
      
      if (!blob) {
        setStatus('Failed to convert canvas to image');
        return;
      }
      
      await shareBlob(blob, 'canvas-drawing.png', { 
        mimeType: 'image/png',
        title: 'Canvas Drawing' 
      });
      setStatus('Canvas image shared successfully');
    } catch (error) {
      setStatus(`Error sharing canvas: ${error}`);
      console.error(error);
    }
  };
  
  const handleShareBase64 = async () => {
    try {
      // This is a simple red dot 1x1 PNG in base64
      const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      
      await shareFile(base64Data, 'red-dot.png', { 
        mimeType: 'image/png',
        title: 'Base64 Image' 
      });
      setStatus('Base64 image shared successfully');
    } catch (error) {
      setStatus(`Error sharing base64 image: ${error}`);
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Sharesheet Plugin Test</h1>
      
      <div style={{ marginBottom: 20 }}>
        <h2>Share Text</h2>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '100%', height: 100 }}
        />
        <button onClick={handleShareText}>Share Text</button>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <h2>Share File</h2>
        <input 
          type="file" 
          ref={fileInputRef}
        />
        <button onClick={handleShareFile}>Share Selected File</button>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <h2>Share Canvas Drawing</h2>
        <canvas 
          ref={canvasRef}
          width={200}
          height={120}
          style={{ border: '1px solid #ccc' }}
        />
        <div>
          <button onClick={handleDrawCanvas}>Draw</button>
          <button onClick={handleShareCanvas}>Share Canvas</button>
        </div>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <h2>Share Base64 Image</h2>
        <button onClick={handleShareBase64}>Share Base64 Image</button>
      </div>
      
      <div style={{ marginTop: 20, padding: 10, background: '#f5f5f5', borderRadius: 5 }}>
        <strong>Status:</strong> {status || 'Ready'}
      </div>
    </div>
  );
}

export default SharesheetTestApp;