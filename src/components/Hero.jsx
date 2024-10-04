import React from 'react';

const ShareButton = () => {
  const appUrl = "https://crypto-tracker-kappa-lac.vercel.app/"; // The URL you want to share

  const handleShare = async () => {
    if (navigator.share) {
      // Web Share API supported (mostly mobile)
      try {
        await navigator.share({
          title: 'Check out this awesome app!',
          text: 'Track crypto in real-time!',
          url: appUrl,
        });
        console.log('Sharing successful');
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      // Fallback for desktop or unsupported browsers
      showFallback();
    }
  };

  const showFallback = () => {
    // Example: open a modal with sharing options or copy the URL to the clipboard
    const fallbackModal = document.getElementById('fallbackModal');
    fallbackModal.style.display = 'block';
    navigator.clipboard.writeText(appUrl); // Copy URL to clipboard for the user
    alert("The link has been copied to your clipboard! Share it manually.");
  };

  return (
    <div>
      <button onClick={handleShare} className="share-button">
        Share App
      </button>

      {/* Fallback Modal (can show sharing buttons here for desktop) */}
      <div id="fallbackModal" style={{ display: 'none' }}>
        <h2>Share via:</h2>
        <ul>
          <li><a href={`https://api.whatsapp.com/send?text=Check out this app! ${appUrl}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          <li><a href={`https://www.facebook.com/sharer/sharer.php?u=${appUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li><a href={`https://twitter.com/share?url=${appUrl}&text=Check out this app!`} target="_blank" rel="noopener noreferrer">Twitter</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ShareButton;
