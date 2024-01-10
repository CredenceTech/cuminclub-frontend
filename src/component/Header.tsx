import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div >
            <div className='flex w-full bg-gradient-to-b from-gray-800 to-gray-300 justify-between items-center px-8 pt-3 h-24'>
                <Link to="/">
                    <img src="src/assets/icon.svg" className='h-10 w-10' alt="Icon Image" />
                </Link>
                <div>
                    <img src="src/assets/icon_name.svg" className='h-24 w-24' alt="Company Name" />
                </div>
                <button onClick={() => setIsMenuOpen(true)}>
                    <img src="src/assets/hemberger.svg" className='h-10 w-9' alt="Hemberger Button" />
                </button>
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
                        transition={{ duration: 0.5 }}>
                        <div className='flex w-full to-gray-300 justify-between items-center px-8 pt-3 h-24 font-custom-font'>
                            <div>
                                <img src="src/assets/icon.svg" className='h-10 w-10' alt="" />
                            </div>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <img src="src/assets/close.svg" className='h-9 w-9' alt="" />
                            </button>
                        </div>
                        <div className='grid grid-rows-6 justify-items-center place-items-center lg:grid-cols-2 text-5xl font-bold text-[#F7C144] gap-5 lg:gap-20  w-full bg-white '>
                            <Link to="/" >Build Your Box</Link>
                            <Link to="/" >Our Story</Link>
                            <Link to="/" >FAQs</Link>
                            <Link to="/" >How It Works</Link>
                            <Link to="/" >Gifts</Link>
                            <Link to="/" >Login</Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default Header