import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function forceDownloadFile(url: string, defaultFilename: string) {
  try {
    // Attempt cross-origin fetch
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response not ok');
    
    // Convert to Blob and create a temporary URL
    const blob = await response.blob();
    const tempUrl = window.URL.createObjectURL(blob);
    
    // Simulate link click to force local download
    const link = document.createElement('a');
    link.href = tempUrl;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(tempUrl);
  } catch (error) {
    console.warn('Direct download blocked by CORS/Network, falling back to new tab:', error);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
