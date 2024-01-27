import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState("India");

    const openCountryDrawer = () => {
        setIsCountryDrawerOpen(true);
    };

    const closeCountryDrawer = () => {
        setIsCountryDrawerOpen(false);
    };

    const onSelectCountry = (country) => {
        setSelectedCountry(country);
        closeCountryDrawer();
    };

    return (
        <div>
            <div className='flex w-full bg-white justify-between items-center px-5 lg:px-48 h-20'>
                <div className='flex gap-3'>
                    <Link to="/">
                        <img src="src/assets/icon.svg" className='h-24 w-24' alt="Icon Image" />
                    </Link>
                    <button onClick={openCountryDrawer}>
                        {selectedCountry === 'India' && (
                            <img alt="IN" className='h-8 w-8' src="https://d222i9ppxs2fqe.cloudfront.net/India.png" />
                        )}
                        {selectedCountry === 'USA' && (
                            <img alt="US" className='h-8 w-8' src="https://d222i9ppxs2fqe.cloudfront.net/USA.png" />
                        )}
                        {selectedCountry === 'Canada' && (
                            <img alt="CA" className='h-8 w-8' src="https://d222i9ppxs2fqe.cloudfront.net/canada.png" />
                        )}
                    </button>
                    {isCountryDrawerOpen && <CountryDrawer onClose={closeCountryDrawer} onSelectCountry={onSelectCountry} />}
                </div>
                <div className='flex gap-3'>
                    <button className='flex bg-[#E91D24] items-center gap-2 py-1 text-white px-3 rounded-xl'>
                        <img src="src/assets/cart.svg" className='h-5 w-5' alt="Hemberger Button" />
                        <span className='font-medium'>10/10</span>
                    </button>
                    <button >
                        <img src="src/assets/hemberger.svg" className='h-9 w-9' alt="Hemberger Button" />
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '-100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '-100%' }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 bg-[#610B15]">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className='h-screen'
                    >
                        <div className='flex w-full to-gray-300 justify-between items-center px-8 pt-3 h-24 font-custom-font'>
                            <div>
                                <img src="src/assets/icon.svg" className='h-10 w-10' alt="" />
                            </div>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <img src="src/assets/close.svg" className='h-9 w-9' alt="" />
                            </button>
                        </div>
                        <div className='grid grid-rows-6 justify-items-center place-items-center lg:grid-cols-2 text-5xl font-bold text-[#F7C144] gap-5 lg:gap-20 h-screen w-full '>
                            <Link to="/" >Build Your Box</Link>
                            <Link to="/" >Our Story</Link>
                            <Link to="/" >FAQs</Link>
                            <Link to="/" >How It Works</Link>
                            <Link to="/" >Gifts</Link>
                            <Link to="/login" >Login</Link>
                        </div>
                        <div className='flex justify-center items-center text-xl gap-10 text-[#D36A19]' >
                            <Link to="/" >Blog</Link>
                            <Link to="/" >Reviews</Link>
                            <Link to="/" >Press Kit</Link>
                            <Link to="/" >Help</Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default Header


const CountryDrawer = ({ onClose, onSelectCountry }) => {
    const handleCountrySelect = (country) => {
        onSelectCountry(country);
    };

    return (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4 }}
            className="fixed z-50 flex flex-col px-7 text-[#E91D24] inset-0 bg-[#FFF] lg:w-4/12">
            <div className="flex justify-between items-center w-full  text-red-700 h-16">
                <img src="src/assets/icon.svg" className='h-24 w-24' alt="Icon Image" />
                <span onClick={onClose} className='cursor-pointer'>
                    <svg fill='red' viewBox="0 0 24 24" width="24px" height="24px"><path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" /></svg>
                </span>
            </div>

            <div className='flex mt-5 flex-col gap-7'>
                <button onClick={() => handleCountrySelect('India')} className='flex justify-between items-center px-10 lg:px-20'>
                    <img alt="IN" className='h-10 w-10' src="https://d222i9ppxs2fqe.cloudfront.net/India.png" />
                    <span>India</span>
                </button>
                <button onClick={() => handleCountrySelect('USA')} className='flex justify-between items-center px-10 lg:px-20'>
                    <img alt="US" className='h-10 w-10' src="https://d222i9ppxs2fqe.cloudfront.net/USA.png" />
                    <span>USA</span>
                </button>
                <button onClick={() => handleCountrySelect('Canada')} className='flex justify-between items-center px-10 lg:px-20'>
                    <img alt="CA" className='h-10 w-10' src="https://d222i9ppxs2fqe.cloudfront.net/canada.png" />
                    <span>Canada</span>
                </button>
            </div>
        </motion.div>
    );
};