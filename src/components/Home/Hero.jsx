import { useState } from 'react';
import IPhone from "../../assets/Iphone.png";
import { Link } from 'react-router-dom';
import Toast from "../Dashboard/Toast";

const Hero = () => {
    const [showToast, setShowToast] = useState(false);

    const handleShare = async () => {
        const appUrl = 'https://crypto-tracker-kappa-lac.vercel.app/';

        const waitForVisibilityChange = () =>
            new Promise((resolve) => {
                const handleVisibilityChange = () => {
                    if (document.visibilityState === 'visible') {
                        resolve();
                        document.removeEventListener('visibilitychange', handleVisibilityChange);
                    }
                };
                document.addEventListener('visibilitychange', handleVisibilityChange);
            });

        try {
            if (navigator.share) {
                // Use the Web Share API if available
                await navigator.share({
                    title: 'Check out this cool Crypto Tracking App!',
                    text: 'Track crypto in real-time with this awesome app!',
                    url: appUrl,
                });

                console.log('App link shared successfully');

                // Wait for user to come back to the page after sharing
                await waitForVisibilityChange();

                // Show the toast when they come back
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000); // Hide the toast after 5 seconds
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(appUrl);
                alert('Sharing not supported in your browser, but the link has been copied to your clipboard!');

                // Wait for user to come back after copying
                await waitForVisibilityChange();

                // Show the toast when they come back
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000); // Hide the toast after 5 seconds
            }
        } catch (error) {
            console.log('Error sharing:', error);
            alert('Failed to share or copy the link. Please try again!');
        }
    };

    return (
        <>
            <div className="max-w-[1880px] min-h-[85vh] mx-auto py-6 px-8 2xl:flex-row flex flex-col mt-4">
                <div className="2xl:w-[50%] w-full 2xl:text-start text-center h-[500px] flex flex-col 2xl:items-start items-center justify-center gap-4 ">
                    <div>
                        <h1 className='font-bold 2xl:text-8xl text-5xl mb-4'>Track Crypto</h1>
                        <h1 className='text-blue-500 font-bold 2xl:text-5xl text-4xl mb-4'>Real Time.</h1>
                    </div>
                    <p className='text-gray-500 lg:text-3xl text-xl mb-4'>Track crypto through a public API in real time. Visit the dashboard to do so!</p>
                    <div className='flex gap-4'>
                        <Link to="/Dashboard" className={`duration-300 sm:py-3 sm:px-6 px-4 py-2 bg-blue-500 text-white rounded-full transition-all hover:shadow-[0_0_10px_10px_rgba(59,130,246,0.5)] text-xl`}>Dashboard</Link>
                        <button onClick={handleShare} className={`text-xl duration-300 sm:py-3 sm:px-6 px-4 py-2 hover:bg-blue-500 border-2 border-blue-500 rounded-full transition-all`}>
                            Share App
                        </button>
                    </div>
                </div>
                <div className='2xl:w-[50%] w-full flex justify-center h-[85vh] px-4'>
                    <div className='h-[700px] relative'>
                        <div className='absolute w-[80%] sm:h-[500px] h-[400px] bg-gradient-to-b from-blue-300 to-blue-400 rounded-[45px] left-[5rem] top-[7rem]'></div>
                        <img src={IPhone} className='sm:h-[600px] h-[500px] animate rounded-[45px]' style={{ boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.5)' }} alt="" />
                    </div>
                </div>
            </div>
            {showToast && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
                    <Toast message="App link shared successfully!" onDismiss={() => setShowToast(false)} duration={5000} />
                </div>
            )}
        </>
    );
};

export default Hero;
