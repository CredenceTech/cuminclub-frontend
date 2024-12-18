import React, { useEffect, useState } from 'react'
import slidingImage from '../assets/facility-sliding1.png'
import facilityImg from '../assets/facility.png'
import fassaiImage from '../assets/fassai.png'
import fdaImg from '../assets/fda.png'
import smetaImg from '../assets/smeta.png'
import spiceBoardImg from '../assets/spice-board.png'
import apedaImg from '../assets/apeda.png'
import brecsImg from '../assets/brecs.png'
import reportTrayImg from '../assets/report-tray.png'
import leePackImg from '../assets/leepack.png'
import packingFacilityImg from '../assets/packing-facility.jpg'
import testingFacilityImg from '../assets/testing-facility.png'
import testingLabImg from '../assets/testing-lab.png'
import kettleFacilityImg from '../assets/kettle-facility.png'
import processingStepsImg from '../assets/facilityfotter.svg'
import { AnimatePresence, motion } from "framer-motion";
import slidingImage2 from '../assets/facility-sliding2.png'
import slidingImage3 from '../assets/facility-sliding3.jpg'
import { wrap } from "popmotion";
import { Link } from 'react-router-dom'
import numberStoryImg from '../assets/numbers-tell-story.jpg'
const Facility = () => {

  const [videoLoaded, setVideoLoaded] = useState(true);
  const mapUrl = "https://www.google.com/maps/dir//instantly+yours/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be01537e4ce2d71:0xf7afa0be646cdf60?sa=X&ved=1t:3061&ictx=111";
  const handlePlayClick = () => {
    setVideoLoaded(true);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImageData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImageData.length);
  };


  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliderImageData.length) % sliderImageData.length);
  };

  const certifiedCompanyData = [fassaiImage, fdaImg, smetaImg, spiceBoardImg, apedaImg, brecsImg]

  const facilityAvailableData = [
    {
      image: reportTrayImg,
      title: 'Steriflow Automatic Retort Machines',
      description: 'These advanced machines from Spain can process up to 1 MT per cycle. It guarantees optimal sterilisation of every meal.'
    },
    {
      image: leePackImg,
      title: 'Leepack Filling Machines',
      description: 'Imported from Korea, these two machines fill 30 pouches per minute, combining speed with precision.'
    },
    {
      image: packingFacilityImg,
      title: 'APACK Tray Sealing Machine',
      description: 'A Turkish marvel that seals 24 trays per minute. It guarantees every product is packaged securely.'
    },
    {
      image: testingFacilityImg,
      title: 'Parle Kowai Spout Pouch Filling Machine',
      description: 'This semi-automatic machine handles spout pouch filling and sealing with complete efficiency.'
    },
    {
      image: testingLabImg,
      title: 'Pouch Dryer Machine',
      description: 'With its inclined conveyor belt, it smoothly transfers products to the incubation area after retort processing.'
    },
    {
      image: kettleFacilityImg,
      title: 'Steam Jacketed Kettles & Stainless Steel Tank Trolleys',
      description: 'These help us cook efficiently and transfer products seamlessly. It helps us ensure consistency in every batch.'
    },
  ]

  const sliderImageData = [
    {
      image: slidingImage,
      text: 'Our chefs are constantly experimenting and coming up with fresh ideas that turn everyday meals into something special.'
    },
    {
      image: slidingImage2,
      text: 'From brainstorming to the final product, we cook food you’ll come back to again and again.'
    },
    {
      image: slidingImage3,
      text: 'We use the process of retorting to keep food fresh for longer without losing flavour or texture.'
    }
  ]

  const previousIndex = currentIndex === 0 ? sliderImageData.length - 1 : currentIndex - 1;

  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = wrap(0, sliderImageData.length, page);
  const nextImageIndex = wrap(0, sliderImageData.length, page + 1);
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };


  return (
    <div className='bg-white'>
      <div className='p-8 lg:p-[60px]'>
        <div className="w-full flex flex-col md:flex-row justify-between items-start">
          <div className="text-left mb-4 md:mb-0">
            <h1 className="font-regola-pro text-[18px] md:text-[24px] font-normal leading-[24px] md:leading-[28.8px] text-[#333333] mb-2">
              Know How we Operate
            </h1>
            <span className="font-regola-pro text-[26px] md:text-[36px] font-medium leading-[26px] md:leading-[43.2px] text-[#333333]">
              All About Our Facilities!
            </span>
          </div>
          <Link to={'/business-inquiry'} rel="noopener noreferrer">
            <button className="flex items-center justify-between h-[50px] md:h-[55px] rounded-[4px] bg-[#EADEC1] px-4 md:px-6">
              <span className="font-regola-pro text-[16px] md:text-[24px] font-normal leading-[20px] md:leading-[28.8px] text-left text-[#333333]">
                Enquire for business
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 19 14" fill="none" className="ml-4">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.5338 0.141846L18.3918 6.99985L11.5338 13.8579L9.74245 12.0665L13.5425 8.26652H0.133789V5.73318H13.5425L9.74245 1.93318L11.5338 0.141846Z" fill="#1D1929" />
              </svg>
            </button>
          </Link>
        </div>
        <div className="w-full text-left mt-4">
          <p className="font-regola-pro text-[16px] md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575]">
            Instantly Yours is powered by nature, driven by convenience. What’s more, our facilities guarantee more than just great food. With cutting-edge technology and eco-friendly practices, we make sure every product receives as much care as efficiency.
          </p>
        </div>
      </div>

      <div className="p-8 lg:px-[60px] lg:pt-[40px] flex flex-wrap-reverse xl:flex-nowrap">
        <div className="w-full xl:w-5/12 shrink-0 relative mapBackgrounImage rounded-[14px] mb-4 md:mb-0 md:mr-6 bg-no-repeat bg-cover bg-center h-[300px] md:h-[500px] xl:h-auto">
          <div className="absolute z-20 bottom-4 left-4 flex flex-col items-start">
            <p className="font-inter text-[16px] md:text-[36px] font-normal leading-[28.8px] md:leading-[43.57px] text-[#333333]">
              Surat, Gujarat
            </p>
          </div>
          <div className="absolute bottom-4 right-10 z-[10] flex items-center ">
            <a href={mapUrl} className='cursor-pointer' target="_blank" rel="noopener noreferrer">
              <button className="flex items-center bg-[#94949491] rounded-[8px] px-4 py-2">
                <span className="text-[14px] md:text-[18px] font-regola-pro leading-[18px] md:leading-[21.6px] text-[#FAFAFA]">
                  Get Directions
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 15 11" fill="none" className="ml-2">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.4334 0.266113L14.6671 5.49985L9.4334 10.7336L8.06633 9.36652L10.9663 6.46652H0.733398V4.53319H10.9663L8.06633 1.63319L9.4334 0.266113Z" fill="#FAFAFA" />
                </svg>
              </button>
            </a>
          </div>
        </div>

        <div className="w-full xl:w-7/12 flex flex-col pb-3 xl:pb-0 ">
          <h1 className="font-inter text-[24px] md:text-[32px] font-normal leading-[28.8px] md:leading-[38.73px] text-[#333333] mb-4">
            We’re From the Heart of Gujarat!
          </h1>
          <p className="font-regola-pro text-[16px] md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575] mb-4">
            You can spot us right at <span className="font-regola-pro text-[16px] md:text-[24px] font-semibold leading-[18px] md:leading-[28.8px] text-[#333333]">Gujarat Agro Mega Food Park</span> where we’re surrounded by fertile land and abundant resources. What does this mean? It means better, fresher ingredients in every meal. With quick access to major ports like Hazira, Nhava Sheva, and JNPT, we make delivery faster, fresher, and more reliable—no matter where you are.
          </p>
          <p className="font-regola-pro text-[16px] md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575]">
            And because we use solar power to keep things running, you’re supporting a sustainable process that’s good for the planet. Everything about our location is designed to make your experience better—fresh meals, delivered on time (from a place that cares).
          </p>
        </div>
      </div>



      <div className='p-8 lg:p-[60px]'>
        <div className="relative w-full h-[575px]">
          {videoLoaded ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/shjf6FlG0eo"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div
              className="relative w-full h-full bg-cover bg-center"
              style={{ backgroundImage: 'url(path/to/your/video-thumbnail.jpg)' }}
            >
              {/* Play Button Overlay */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="bg-transparent border-none p-0"
              aria-label="Play Video"
              onClick={handlePlayClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="33"
                viewBox="0 0 28 33"
                fill="none"
                className="text-white cursor-pointer"
              >
                <path d="M28 16.5L0.249998 32.5215L0.25 0.47853L28 16.5Z" fill="#EB7E01"/>
              </svg>
            </button>
          </div> */}
            </div>
          )}
        </div>
      </div>

      <div className=" pl-8 lg:pl-[60px] pr-0">
        {/* Header Section */}
        <div className="flex items-center mb-3">
          <p className="mr-2 font-regola-pro text-[26px] md:text-[36px] leading-[30px] md:leading-[43.2px] font-[500]">
            We Bring Great Food to Life
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="14"
            viewBox="0 0 19 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5338 0.141846L18.3918 6.99985L11.5338 13.8579L9.74245 12.0665L13.5425 8.26652H0.133789V5.73318H13.5425L9.74245 1.93318L11.5338 0.141846Z"
              fill="#1D1929"
            />
          </svg>
        </div>

        {/* Slider Section */}
        <div className="relative flex items-center w-full overflow-hidden pt-2">
          <div className="w-full mb-4 flex lg:mb-0">
            <div className="w-full flex gap-x-7">
              <div
                key={page}
                className={`w-5/6 slide-in-next`}
              >
                <div className="slider-slide flex-shrink-0 relative mr-5">
                  <img
                    src={sliderImageData[imageIndex].image}
                    alt="sliding image"
                    className="w-full h-[300px] md:h-[500px] object-cover mr-20"
                  />
                  <div className="absolute font-[400] bottom-0 left-0 bg-gradient-to-b from-primary to-secondary font-skillet text-[24px] md:text-[36px] leading-[30px] md:leading-[36.32px] text-[#FFFFFF] ">
                    <p className="p-8 w-[90%] md:w-[80%]">{sliderImageData[imageIndex].text}</p>
                  </div>
                </div>
              </div>
              <div
                key={nextImageIndex}
                className={`w-1/6 relative overflow-hidden `}
              >
                <div className="w-[530%] relative -left-[10%] overflow-hidden">
                  <div className="slider-slide flex-shrink-0 relative mr-10 md:mr-40">
                    <img
                      src={sliderImageData[nextImageIndex].image}
                      alt="sliding image"
                      className="w-full h-[300px] md:h-[500px] object-cover bg-left"
                    />
                    <div className="absolute font-[400] bottom-0 left-4 font-skillet text-[24px] md:text-[36px] leading-[30px] md:leading-[36.32px] bg-gradient-to-b from-primary to-secondary text-[#FFFFFF] py-10 pl-10">
                      {sliderImageData[nextImageIndex].text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 w-[40px] h-[40px] md:w-[57px] md:h-[57px] bg-[#FFFFFF] flex items-center justify-center"
            // onClick={handleNext}
            onClick={() => paginate(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="14"
              viewBox="0 0 19 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5338 0.141846L18.3918 6.99985L11.5338 13.8579L9.74245 12.0665L13.5425 8.26652H0.133789V5.73318H13.5425L9.74245 1.93318L11.5338 0.141846Z"
                fill="#1D1929"
              />
            </svg>
          </div>
        </div>

      </div>
      <div className='pl-8 pt-[120px] pb-[60px] lg:pl-[60px] flex flex-wrap md:flex-nowrap'>
        <div className="w-full md:w-2/3 mr-0 md:mr-6">
          <div className="flex flex-col text-left mb-10">
            <h1 className="text-[26px] md:text-[36px] font-[500] leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro">
              Our Numbers Tell the Story
            </h1>
            <p className="text-[18px] md:text-[24px] font-normal leading-[24px] md:leading-[28.8px] text-[#757575] font-regola-pro mt-3">
              In just 4 years, we’ve made an impact that speaks for itself
            </p>
          </div>

          <div className="flex flex-wrap md:space-x-8 mb-6">
            <div className="flex-1 mb-6 md:mb-0">
              <h2 className="text-[22px]  font-medium leading-[30px] md:text-[46px] md:leading-[55.2px] text-[#333333] font-regola-pro">
                12.5 million KGs
              </h2>
              <p className="text-[16px] md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro">
                of quality food products manufactured
              </p>
            </div>
            <div className="flex-1 pr-8">
              <h2 className="text-[22px]  font-medium leading-[30px] md:text-[46px] md:leading-[55.2px] text-[#333333] font-regola-pro">
                100+ SKUs
              </h2>
              <p className="text-[16px] md:text-[24px] font-normal max-w-[290px] leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro">
                bringing variety and choice to our customers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap md:space-x-8 pt-3">
            <div className="flex-1 mb-6 md:mb-0">
              <h2 className="text-[22px] font-medium leading-[30px] md:text-[46px] md:leading-[55.2px] text-[#333333] font-regola-pro">
                200+ employees
              </h2>
              <p className="text-[16px] md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro">
                dedicated to delivering the best
              </p>
            </div>
            <div className="flex-1">
              <h2 className="text-[22px] font-medium leading-[30px] md:text-[46px] md:leading-[55.2px] text-[#333333] font-regola-pro">
                25+ clients
              </h2>
              <p className="text-[16px] md:text-[24px] font-normal max-w-[315px] leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro">
                across five continents, trusting us to serve them
              </p>
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/3  lg:w-[600px] bg-cover mt-8 md:mt-0 h-[200px] md:h-auto bg-[#D9D9D9] rounded-tl-[8px] rounded-bl-[8px]' style={{
          backgroundImage: `url(${numberStoryImg})`,
        }}>
        </div>
      </div>

      <div className='p-8 lg:p-[60px]'>
        <div className='w-full text-left'>
          <h1 className='text-[26px] md:text-[36px] font-[500] leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro'>
            Peek Inside Our World-Class Facilities
          </h1>
          <p className='text-[16px] md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro mt-4'>
            We know that great food starts with an exceptional facility. That's why we've invested in top-tier infrastructure and cutting-edge equipment to ensure every meal we produce is of the highest quality.
          </p>
          <p className='text-[16px]  md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro mt-7'>
            Our facility is fully BRCGS Standards Compliant, which means we follow strict food safety guidelines at every step.
          </p>

          <img src={facilityImg} alt="Facility" className='w-full mt-8 mb-8 object-cover' />

          <p className='text-[16px]  md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro mt-4'>
            The structure itself is built tough with iron framing, PU flooring and false ceilings to maintain cleanliness. We’ve got in-house cold storage with a 13 MT capacity and a massive 250 MT storage space for finished goods—so we’re always ready to deliver, no matter the demand.
          </p>
          <p className='text-[16px]  md:text-[24px] font-normal leading-[18px] md:leading-[28.8px] text-[#757575] font-regola-pro mt-7'>
            And when it comes to shipping, we’ve a waterproof loading dock and two goods elevators that make sure everything gets where it needs to be, quickly and safely.
          </p>
        </div>
      </div>



      <div className='p-8 lg:p-[60px]'>
        <h1 className='text-[26px] md:text-[36px] font-[500] leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro text-left'>
          As Certified By:
        </h1>
        <div className='flex flex-wrap gap-x-[80px] gap-y-[40px] mt-10 justify-center items-center'>
          <div className=' h-[112px]' >
            <img
              src={certifiedCompanyData[0]} alt={`Image `}
              className='w-[200px] h-[112px] object-cover'
            />
          </div>
          <div className=' h-[60px]' >
            <img
              src={certifiedCompanyData[1]} alt={`Image `}
              className='w-[144px] h-[60px] object-cover'
            />
          </div>
          <div className='  h-[74px]' >
            <img
              src={certifiedCompanyData[2]} alt={`Image `}
              className='w-[231] h-[74px] object-cover'
            />
          </div>
          <div className=' h-[83px]' >
            <img
              src={certifiedCompanyData[3]} alt={`Image `}
              className='w-[280px] h-[83px] object-cover'
            />
          </div>
          <div className=' h-[131px]' >
            <img
              src={certifiedCompanyData[4]} alt={`Image `}
              className='w-[235px] h-[131px] object-cover'
            />
          </div>
          <div className=' h-[101px' >
            <img
              src={certifiedCompanyData[5]} alt={`Image `}
              className='w-[250px] h-[101px] object-cover'
            />
          </div>
        </div>
      </div>


      <div className='p-8 lg:p-[60px]'>
        <h1 className='text-[26px] md:text-[36px] font-[500] leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro text-left'>
          Machineries We are Proud of →
        </h1>
        <div className='flex flex-wrap gap-[10px]  mt-8 ml-0 md:ml-[8%] lg:ml-[10%]'>
          {facilityAvailableData.map((item, index) => (
            <div
              key={index}
              className='w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%)-20px] xl:w-[calc(33.33%-40px)] mb-10'
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-[300px] h-[220px] lg:w-[347px] lg:h-[243px] object-cover"
              />
              <div className='mt-4 w-[60%] md:w-[80%] 2xl:w-[70%] relative'>
                <h2 className='text-[20px] md:text-[26px] font-[400] leading-[24px] md:leading-[31.2px] text-[#202020] font-regola-pro'>
                  {item.title}
                </h2>
                <p className='text-[14px] md:text-[16px] font-[400] leading-[18px] md:leading-[19.2px] font-regola-pro text-[#202020] mt-2'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='p-8 lg:px-[60px] '>
        <h1 className='text-[26px] md:text-[36px] font-[500] leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro text-left'>
          Retort Processing
        </h1>
        <img
          src={processingStepsImg}
          alt='Retort Processing'
          className='w-full h-auto object-cover mt-4'
        />
      </div>






    </div>
  )
}

export default Facility