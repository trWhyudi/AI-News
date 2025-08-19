import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { AiOutlineRobot } from 'react-icons/ai';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-custom-border py-12 mt-16">
        <div
            className="container mx-auto px-4"
            data-aos="fade-up"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                    <div className="flex items-center mb-4">
                        <div className="relative">
                            <AiOutlineRobot className="text-primary text-2xl mr-2" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"></div>
                        </div>
                        <span className="text-gray-800 font-bold text-xl">
                            <span className="gradient-text">AI</span> News
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Your trusted source for the latest Artificial Intelligence news and developments from around the world.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-black transition">
                            <FaXTwitter size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-800 transition">
                            <FiGithub size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-600 transition">
                            <FiInstagram size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                            <FiLinkedin size={18} />
                        </a>
                    </div>
                </div>
                
                <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-600 hover:text-primary transition text-sm">Home</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary transition text-sm">Trending</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary transition text-sm">Categories</a></li>
                        <li><a href="#" className="text-gray-600 hover:text-primary transition text-sm">Saved Articles</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="font-semibold text-gray-800 mb-4">News Sources</h3>
                    <ul className="space-y-2">
                        <li><a href="https://gnews.io/" className="text-gray-600 hover:text-primary transition text-sm" target="_blank">GNews</a></li>
                        <li><a href="https://developer.nytimes.com/apis" className="text-gray-600 hover:text-primary transition text-sm" target="_blank">New York Times</a></li>
                        <li><a href="https://open-platform.theguardian.com/" className="text-gray-600 hover:text-primary transition text-sm" target="_blank">The Guardian</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="pt-8 border-t border-custom-border flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left text-sm text-gray-500 mb-4 md:mb-0">
                    © {new Date().getFullYear()}{' '}
                    <span className="font-semibold gradient-text">AI News</span>. All rights reserved.
                </div>

                <div className="text-center text-xs text-gray-400">
                    Powered by GNews, New York Times, and The Guardian
                </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;