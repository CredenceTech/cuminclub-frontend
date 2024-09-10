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
import packingFacilityImg from '../assets/packing-facility.png'
import testingFacilityImg from '../assets/testing-facility.png'
import testingLabImg from '../assets/testing-lab.png'
import kettleFacilityImg from '../assets/kettle-facility.png'
import processingStepsImg from '../assets/processing-steps.png'


const Facility = () => {

  const [videoLoaded, setVideoLoaded] = useState(true);

  const handlePlayClick = () => {
    setVideoLoaded(true);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextSlide = () => {
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
      image: slidingImage,
      text: 'From brainstorming to the final product, we cook food you’ll come back to again and again.'
    },
    {
      image: slidingImage,
      text: 'From brainstorming to the final product, we cook food you’ll come back to again and again.'
    }
  ]
  return (
    <div className='bg-white'>
      <div className='p-8'>
        <div className="w-full flex flex-col md:flex-row justify-between items-start">
          <div className="text-left mb-4 md:mb-0">
            <h1 className="font-regola-pro text-[18px] md:text-[20px] font-normal leading-[24px] md:leading-[28.8px] text-[#333333] mb-2">
              Know How we Operate
            </h1>
            <span className="font-regola-pro text-[26px] md:text-[30px] font-medium leading-[26px] md:leading-[36px] text-[#333333]">
              All About Our Facilities!
            </span>
          </div>
          <button className="flex items-center justify-between h-[50px] md:h-[65px] rounded-[4px] bg-[#EADEC1] px-4 md:px-6">
            <span className="font-regola-pro text-[16px] md:text-[24px] font-normal leading-[20px] md:leading-[28.8px] text-left text-[#333333]">
              Enquire for business
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 19 14" fill="none" className="ml-2">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5338 0.141846L18.3918 6.99985L11.5338 13.8579L9.74245 12.0665L13.5425 8.26652H0.133789V5.73318H13.5425L9.74245 1.93318L11.5338 0.141846Z" fill="#1D1929" />
            </svg>
          </button>
        </div>
        <div className="w-full text-left mt-4">
          <p className="font-regola-pro text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-[#757575]">
            Instantly Yours is powered by nature, driven by convenience. What’s more, our facilities guarantee more than just great food. With cutting-edge technology and eco-friendly practices, we make sure every product receives as much care as efficiency.
          </p>
        </div>
      </div>

      <div className="p-8 flex flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/2 relative bg-cover bg-center mapBackgrounImage rounded-[14px] mb-4 md:mb-0 md:mr-2 bg-no-repeat bg-cover bg-center h-[300px] md:h-auto">
          <div className="absolute bottom-4 left-4 flex flex-col items-start">
            <p className="font-inter text-[16px] md:text-[20px] font-normal leading-[28.8px] md:leading-[43.57px] text-[#333333]">
              Surat, Gujarat
            </p>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center cursor-pointer">
            <button className="flex items-center bg-[#94949491] rounded-[8px] px-4 py-2">
              <span className="text-[14px] md:text-[18px] font-regola-pro leading-[18px] md:leading-[21.6px] text-[#FAFAFA]">
                Get Directions
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 15 11" fill="none" className="ml-2">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.4334 0.266113L14.6671 5.49985L9.4334 10.7336L8.06633 9.36652L10.9663 6.46652H0.733398V4.53319H10.9663L8.06633 1.63319L9.4334 0.266113Z" fill="#FAFAFA" />
              </svg>
            </button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="71" height="81" viewBox="0 0 71 81" fill="none" className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.785156 35.0787C0.785156 15.7074 16.5055 0 35.8852 0C55.2648 0 70.9852 15.7074 70.9852 35.0787C70.9852 49.5185 63.7584 60.9583 56.0187 68.6929C52.14 72.5691 48.0769 75.5745 44.5967 77.6256C42.8575 78.6506 41.2321 79.4561 39.819 80.0138C38.4849 80.5404 37.0846 80.9507 35.8852 80.9507C34.6858 80.9507 33.2854 80.5404 31.9513 80.0138C30.5382 79.4561 28.9128 78.6506 27.1736 77.6256C23.6934 75.5745 19.6303 72.5691 15.7516 68.6929C8.01191 60.9583 0.785156 49.5185 0.785156 35.0787Z"
                  fill="#EB7E01"
                />
              </svg>
              <div className="absolute flex items-center justify-center text-center">
                <p className="text-white font-bold px-2 break-words leading-[14px]">
                  instantly yours
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col pl-3">
          <h1 className="font-inter text-[24px] md:text-[30px] font-normal leading-[28.8px] md:leading-[38.73px] text-[#333333] mb-4">
            We’re From the Heart of Gujarat!
          </h1>
          <p className="font-regola-pro text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-[#757575] mb-4">
            You can spot us right at <span className="font-regola-pro text-[16px] md:text-[18px] font-semibold leading-[18px] md:leading-[20px] text-[#333333]">Gujarat Agro Mega Food Park</span> where we’re surrounded by fertile land and abundant resources. What does this mean? It means better, fresher ingredients in every meal. With quick access to major ports like Hazira, Nhava Sheva, and JNPT, we make delivery faster, fresher, and more reliable—no matter where you are.
          </p>
          <p className="font-regola-pro text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-[#757575]">
            And because we use solar power to keep things running, you’re supporting a sustainable process that’s good for the planet. Everything about our location is designed to make your experience better—fresh meals, delivered on time (from a place that cares).
          </p>
        </div>
      </div>



      <div className='p-8'>
        <div className="relative w-full h-[500px]">
          {videoLoaded ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/DKPkvM0Refk"
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

      <div className="p-8">
        {/* Header Section */}
        <div className="flex items-center mb-3">
          <p className="mr-2 font-regola-pro text-[26px] md:text-[30px] leading-[30px] md:leading-[43.2px] font-semibold">
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
        <div className="relative flex items-center w-full overflow-hidden">
          <div className="slider-wrapper relative w-full overflow-hidden">
            <div
              className="slider-track flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 80}%)` }}
            >
              {sliderImageData.map((image, index) => (
                <div
                  key={index}
                  className="slider-slide flex-shrink-0 w-[80%] relative mr-10 md:mr-40"
                >
                  <img
                    src={image.image}
                    alt="sliding image"
                    className="w-full h-[300px] md:h-[500px] object-cover mr-20"
                  />
                  <div className="absolute bottom-4 left-4 font-skillet text-[24px] md:text-[36px] leading-[30px] md:leading-[36.32px] text-[#FFFFFF] p-4 w-[90%] md:w-[70%]">
                    {image.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 w-[40px] h-[40px] md:w-[57px] md:h-[57px] bg-[#FFFFFF] flex items-center justify-center"
            onClick={handleNextSlide}
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


      <div className='pl-8 pt-8 pb-8 flex flex-wrap md:flex-nowrap'>
        <div className="w-full md:w-2/3 mr-0 md:mr-6">
          <div className="flex flex-col text-left mb-8">
            <h1 className="text-[26px] md:text-[30px] font-semibold leading-[34px] md:leading-[40px] text-[#333333] font-regola-pro">
              Our Numbers Tell the Story
            </h1>
            <p className="text-[18px] md:text-[22px] font-normal leading-[24px] md:leading-[26px] text-[#757575] font-regola-pro mt-4">
              In just 4 years, we’ve made an impact that speaks for itself
            </p>
          </div>

          <div className="flex flex-wrap md:space-x-8 mb-6">
            <div className="flex-1 mb-6 md:mb-0">
              <h2 className="text-[22px] md:text-[30px] font-medium leading-[30px] md:leading-[40px] text-[#333333] font-regola-pro">
                12.5 million KGs
              </h2>
              <p className="text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[22px] text-[#757575] font-regola-pro">
                of quality food products manufactured
              </p>
            </div>
            <div className="flex-1">
              <h2 className="text-[22px] md:text-[30px] font-medium leading-[30px] md:leading-[40px] md:leading-[55.2px] text-[#333333] font-regola-pro">
                100+ SKUs
              </h2>
              <p className="text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[22px] text-[#757575] font-regola-pro">
                bringing variety and choice to our customers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap md:space-x-8">
            <div className="flex-1 mb-6 md:mb-0">
              <h2 className="text-[22px] md:text-[30px] font-medium leading-[30px] md:leading-[40px] md:leading-[55.2px] text-[#333333] font-regola-pro">
                200+ employees
              </h2>
              <p className="text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[22px] text-[#757575] font-regola-pro">
                dedicated to delivering the best
              </p>
            </div>
            <div className="flex-1">
              <h2 className="text-[22px] md:text-[30px] font-medium leading-[30px] md:leading-[40px] md:leading-[55.2px] text-[#333333] font-regola-pro">
                25+ clients
              </h2>
              <p className="text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[22px] text-[#757575] font-regola-pro">
                across five continents, trusting us to serve them
              </p>
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/3 mt-8 md:mt-0 h-[200px] md:h-auto bg-[#D9D9D9] rounded-tl-[8px] rounded-bl-[8px]'>

        </div>
      </div>




      <div className='p-8'>
        <div className='w-full text-left'>
          <h1 className='text-[26px] md:text-[30px] font-semibold leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro'>
            Peek Inside Our World-Class Facilities
          </h1>
          <p className='text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-[#757575] font-regola-pro mt-4'>
            We know that great food starts with an exceptional facility. That's why we've invested in top-tier infrastructure and cutting-edge equipment to ensure every meal we produce is of the highest quality.
          </p>
          <p className='text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-[#757575] font-regola-pro mt-4'>
            Our facility is fully BRCGS Standards Compliant, which means we follow strict food safety guidelines at every step.
          </p>

          <img src={facilityImg} alt="Facility" className='w-full mt-8 mb-8 object-cover' />

          <p className='text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-[#757575] font-regola-pro mt-4'>
            The structure itself is built tough with iron framing, PU flooring and false ceilings to maintain cleanliness. We’ve got in-house cold storage with a 13 MT capacity and a massive 250 MT storage space for finished goods—so we’re always ready to deliver, no matter the demand.
          </p>
          <p className='text-[16px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-[#757575] font-regola-pro mt-4'>
            And when it comes to shipping, we’ve a waterproof loading dock and two goods elevators that make sure everything gets where it needs to be, quickly and safely.
          </p>
        </div>
      </div>



      <div className='p-8'>
        <h1 className='text-[26px] md:text-[30px] font-semibold leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro text-left'>
          As Certified By:
        </h1>
        <div className='flex flex-wrap gap-6 mt-8 justify-center items-center'>
          {certifiedCompanyData.map((img, index) => (
            <div
              key={index}
              className='w-full sm:w-[calc(50%-12px)] md:w-[calc(33%-24px)] lg:w-[calc(25%-40px)] h-auto'
            >
              <img
                src={img}
                alt={`Image ${index + 1}`}
                className='w-full h-auto object-cover'
              />
            </div>
          ))}
        </div>
      </div>




      <div className='p-8'>
        <h1 className='text-[26px] md:text-[30px] font-semibold leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro text-left'>
          Machineries We are Proud of →
        </h1>
        <div className='flex flex-wrap gap-6 mt-8'>
          {facilityAvailableData.map((item, index) => (
            <div
              key={index}
              className='w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-40px)]'
            >
              <img
                src={item.image}
                alt={item.title}
                className='w-full h-auto object-cover'
              />
              <div className='mt-4'>
                <h2 className='text-[20px] md:text-[22px] font-medium leading-[24px] md:leading-[30px] text-[#000000] font-regola-pro'>
                  {item.title}
                </h2>
                <p className='text-[14px] md:text-[16px] font-medium leading-[18px] md:leading-[19.2px] text-[#757575] mt-2'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>




      <div className='p-8'>
        <h1 className='text-[26px] md:text-[30px] font-semibold leading-[34px] md:leading-[43.2px] text-[#333333] font-regola-pro text-left'>
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