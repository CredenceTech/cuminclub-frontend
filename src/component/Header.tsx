import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isCountryDrawerOpen, setIsCountryDrawerOpen] = React.useState(false);

    const openCountryDrawer = () => {
        setIsCountryDrawerOpen(true);
    };

    const closeCountryDrawer = () => {
        setIsCountryDrawerOpen(false);
    };

    return (
        <div>
            <div className='flex w-full bg-white justify-between items-center px-5 lg:px-48 h-20'>
                <div className='flex gap-3'>
                    <Link to="/">
                        <img src="src/assets/icon.svg" className='h-24 w-24' alt="Icon Image" />
                    </Link>
                    <button onClick={openCountryDrawer}>
                        <img src="src/assets/india.svg" className='h-9 w-9' alt="India" />
                    </button>

                    {isCountryDrawerOpen && <CountryDrawer onClose={closeCountryDrawer} />}
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


const CountryDrawer = ({ onClose }) => {
    return (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4 }}
            className="fixed flex text-red-400 inset-0 bg-[#FFF] lg:w-4/12">
            <div className="flex justify-between items-center w-full px-7 text-red-700 h-16">
                <img src="src/assets/icon.svg" className='h-24 w-24' alt="Icon Image" />
                <span onClick={onClose} className='cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40px" height="40px"><path fill="#E91D24" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)" /><path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)" /></svg>
                </span>
            </div>
        </motion.div>
    );
};