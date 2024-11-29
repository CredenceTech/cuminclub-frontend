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
            <button className="flex items-center justify-between h-[50px] md:h-[65px] rounded-[4px] bg-[#EADEC1] px-4 md:px-6">
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

      <div className="p-8 lg:px-[60px] lg:pt-[40px] flex flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/2 relative mapBackgrounImage rounded-[14px] mb-4 md:mb-0 md:mr-6 bg-no-repeat bg-cover bg-center h-[300px] md:h-auto">
          <div className="absolute bottom-4 left-4 flex flex-col items-start">
            <p className="font-inter text-[16px] md:text-[36px] font-normal leading-[28.8px] md:leading-[43.57px] text-[#333333]">
              Surat, Gujarat
            </p>
          </div>

          <div className="absolute bottom-4 right-10 flex items-center cursor-pointer">
            <a href="https://g.co/kgs/bZfmdTz" target="_blank" rel="noopener noreferrer">
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

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 81 81" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.78516 35.0787C5.78516 15.7074 21.5055 0 40.8852 0C60.2648 0 75.9852 15.7074 75.9852 35.0787C75.9852 49.5185 68.7584 60.9583 61.0187 68.6929C57.14 72.5691 53.0769 75.5745 49.5967 77.6256C47.8575 78.6506 46.2321 79.4561 44.819 80.0138C43.4849 80.5404 42.0846 80.9507 40.8852 80.9507C39.6858 80.9507 38.2854 80.5404 36.9513 80.0138C35.5382 79.4561 33.9128 78.6506 32.1736 77.6256C28.6934 75.5745 24.6303 72.5691 20.7516 68.6929C13.0119 60.9583 5.78516 49.5185 5.78516 35.0787Z" fill="#EB7E01" />
                <path d="M15.9362 25.2371C15.7135 25.0144 15.6279 24.9117 15.6279 24.7746C15.6279 24.5005 15.9191 24.3292 16.9982 23.8838C17.889 23.4727 18.1802 23.3871 18.4201 23.3871C18.6255 23.3871 18.7626 23.5413 18.7626 23.9181C18.7626 24.3121 18.6941 24.9117 18.6941 26.5732V27.8579C18.6941 28.4403 19.0367 28.663 19.0367 29.0056C19.0367 29.3654 18.4885 29.5366 17.5978 29.5366H17.4265C16.5186 29.5366 15.9704 29.3654 15.9704 29.0056C15.9704 28.663 16.3302 28.4403 16.3302 27.8579V27.0185C16.3302 25.6825 16.296 25.631 15.9362 25.2371Z" fill="white" />
                <path d="M19.9105 25.3575C19.6707 25.152 19.5508 25.0492 19.5508 24.8265C19.5508 24.5695 19.7393 24.381 20.6128 23.9014C21.5207 23.4046 21.9147 23.2505 22.2402 23.2505C22.5143 23.2505 22.6342 23.4046 22.6342 23.713C22.6342 23.8329 22.6171 23.97 22.5999 24.1584C23.0282 23.6959 23.5934 23.3876 24.2443 23.3876C25.3578 23.3876 25.5634 24.1754 25.7175 25.6658C25.8203 26.6936 25.9231 27.4473 25.9916 27.927C26.0772 28.3723 26.2314 28.5779 26.5398 28.6635C26.7453 28.7149 26.7795 28.9375 26.6254 29.0918C26.3856 29.3144 25.8032 29.5371 25.1179 29.5371C24.0388 29.5371 23.6791 29.0918 23.6277 28.2011C23.5763 27.5673 23.542 27.0019 23.4906 25.9913C23.4564 24.895 23.3879 24.4667 23.0795 24.4667C22.7198 24.4667 22.5656 25.2547 22.5485 26.2824V27.8584C22.5485 28.4408 22.8911 28.6635 22.8911 29.0061C22.8911 29.3659 22.3601 29.5371 21.4522 29.5371H21.298C20.3902 29.5371 19.842 29.3659 19.842 29.0061C19.842 28.6635 20.1846 28.4408 20.1846 27.8584V27.0019C20.1846 25.9228 20.1846 25.6144 19.9105 25.3575Z" fill="white" />
                <path d="M30.7364 25.8198C32.398 26.2994 32.9462 26.8647 32.9462 27.7555C32.9462 29.0059 31.5929 29.6226 29.8628 29.6226C28.4581 29.6226 27.4133 29.3143 27.0535 28.4406C26.7795 27.7555 27.2077 27.0874 28.0127 27.0874C28.6123 27.0874 29.0919 27.4129 29.1262 28.0638C29.1605 28.6805 29.3831 28.9374 29.7428 28.9374C30.1712 28.9374 30.3938 28.6119 30.3938 28.1323C30.3938 27.6698 29.9656 27.2073 29.1776 27.0018C28.0984 26.7105 27.1905 26.231 27.1905 25.2545C27.1905 24.0212 28.6294 23.3703 30.274 23.3703C31.5072 23.3703 32.3637 23.7642 32.6549 24.4323C32.9289 25.1175 32.5179 25.7342 31.7299 25.7342C31.1304 25.7342 30.7707 25.4601 30.6336 24.792C30.5309 24.2439 30.4967 24.0554 30.1368 24.0554C29.7943 24.0554 29.7257 24.3467 29.7257 24.7234C29.7257 25.1346 30.0169 25.6143 30.7364 25.8198Z" fill="white" />
                <path d="M36.7834 24.4665H36.0981V26.6419C36.0981 27.6697 36.1838 27.9439 36.5435 27.9439C36.8176 27.9439 36.8862 27.7896 36.9888 27.6697C37.1773 27.4641 37.3829 27.5498 37.2972 27.8753C37.0916 28.6975 36.6121 29.6226 35.413 29.6226C34.3166 29.6226 33.7343 28.8174 33.7343 27.1729V24.4665H33.5801C33.3574 24.4665 33.1689 24.278 33.1689 24.0554C33.1689 23.8156 33.3402 23.6442 33.5629 23.6271H33.5801C34.5051 23.6271 34.8991 23.1989 35.1731 22.4281C35.3102 22.0341 35.5329 21.8285 35.7898 21.8285C36.0468 21.8285 36.1667 22.0341 36.1667 22.3424C36.1667 22.9076 36.1153 23.2502 36.0981 23.6271H36.7834C37.0061 23.6271 37.2116 23.8156 37.2116 24.0554C37.2116 24.278 37.0061 24.4665 36.7834 24.4665Z" fill="white" />
                <path d="M41.0997 26.1449L40.8599 26.2477C40.2945 26.5561 40.0891 27.1556 40.0891 27.6352C40.0891 28.1491 40.2774 28.4232 40.6372 28.4232C40.9798 28.4232 41.3566 28.0292 41.1853 26.7787L41.0997 26.1449ZM42.8812 29.5366C41.9391 29.5366 41.5965 29.1255 41.4766 28.5602C41.0826 29.1427 40.4487 29.5195 39.6094 29.5195C38.4617 29.5195 37.708 28.9714 37.708 28.0805C37.708 27.2413 38.376 26.6417 39.5581 26.2135C40.7742 25.7681 40.9798 25.5968 40.9798 25.3055C40.877 24.4662 40.7914 24.1065 40.5516 24.1065C40.346 24.1065 40.2603 24.3977 40.1404 24.8773C40.0034 25.4427 39.6265 25.8366 38.9414 25.7852C38.3247 25.7681 37.9992 25.3055 38.1191 24.7403C38.3247 23.8838 39.2668 23.387 40.6372 23.387C42.3844 23.387 43.2237 24.1407 43.4293 25.631C43.5836 26.693 43.7205 27.8579 43.7719 28.0805C43.8405 28.4917 43.9432 28.5773 44.2516 28.6801C44.4743 28.7315 44.5085 28.9542 44.3372 29.1083C44.1317 29.2968 43.5836 29.5366 42.8812 29.5366Z" fill="white" />
                <path d="M45.057 25.3575C44.8172 25.152 44.6973 25.0492 44.6973 24.8265C44.6973 24.5695 44.8857 24.381 45.7593 23.9014C46.6672 23.4046 47.0612 23.2505 47.3867 23.2505C47.6608 23.2505 47.7807 23.4046 47.7807 23.713C47.7807 23.8329 47.7635 23.97 47.7463 24.1584C48.1745 23.6959 48.7399 23.3876 49.3908 23.3876C50.5042 23.3876 50.7098 24.1754 50.864 25.6658C50.9667 26.6936 51.0696 27.4473 51.138 27.927C51.2237 28.3723 51.3779 28.5779 51.6863 28.6635C51.8917 28.7149 51.926 28.9375 51.7718 29.0918C51.532 29.3144 50.9497 29.5371 50.2644 29.5371C49.1853 29.5371 48.8256 29.0918 48.7742 28.2011C48.7228 27.5673 48.6885 27.0019 48.6371 25.9913C48.6028 24.895 48.5344 24.4667 48.226 24.4667C47.8663 24.4667 47.7121 25.2547 47.695 26.2824V27.8584C47.695 28.4408 48.0376 28.6635 48.0376 29.0061C48.0376 29.3659 47.5065 29.5371 46.5987 29.5371H46.4445C45.5367 29.5371 44.9884 29.3659 44.9884 29.0061C44.9884 28.6635 45.3311 28.4408 45.3311 27.8584V27.0019C45.3311 25.9228 45.3311 25.6144 45.057 25.3575Z" fill="white" />
                <path d="M55.3351 24.4665H54.6499V26.6419C54.6499 27.6697 54.7355 27.9439 55.0953 27.9439C55.3693 27.9439 55.4379 27.7896 55.5406 27.6697C55.7291 27.4641 55.9347 27.5498 55.849 27.8753C55.6434 28.6975 55.1637 29.6226 53.9647 29.6226C52.8684 29.6226 52.286 28.8174 52.286 27.1729V24.4665H52.1318C51.9092 24.4665 51.7207 24.278 51.7207 24.0554C51.7207 23.8156 51.892 23.6442 52.1147 23.6271H52.1318C53.0569 23.6271 53.4508 23.1989 53.7249 22.4281C53.8619 22.0341 54.0846 21.8285 54.3416 21.8285C54.5985 21.8285 54.7184 22.0341 54.7184 22.3424C54.7184 22.9076 54.6671 23.2502 54.6499 23.6271H55.3351C55.5578 23.6271 55.7633 23.8156 55.7633 24.0554C55.7633 24.278 55.5578 24.4665 55.3351 24.4665Z" fill="white" />
                <path d="M56.431 22.3936C56.2083 22.2223 56.0713 22.1195 56.0713 21.8968C56.0713 21.6399 56.3797 21.4514 57.2704 20.9719C58.1612 20.4922 58.5551 20.3552 58.8634 20.3552C59.1547 20.3552 59.3088 20.5264 59.3088 20.8005C59.3088 21.1773 59.1718 21.6399 59.1718 23.6612V27.8579C59.1718 28.4404 59.5316 28.6631 59.5316 29.0056C59.5316 29.3654 59.0006 29.5366 58.0755 29.5366H57.9213C56.9964 29.5366 56.4654 29.3654 56.4654 29.0056C56.4654 28.6631 56.825 28.4404 56.825 27.8579V24.0723C56.825 22.9589 56.7737 22.6848 56.431 22.3936Z" fill="white" />
                <path d="M60.799 25.6657C60.1309 24.1754 59.6855 24.2782 59.6855 23.8158C59.6855 23.4559 60.5077 23.2675 61.4499 23.2675H61.6041C62.5462 23.2675 63.1799 23.4389 63.1799 23.7985C63.1799 24.1412 62.7861 24.3295 62.9916 24.8605C63.1799 25.4259 63.6425 26.762 63.968 27.4986C64.3106 26.6079 64.5161 25.8713 64.773 25.2033C65.0642 24.4838 64.893 24.3124 64.5847 24.1754C64.242 24.0213 64.1392 23.8842 64.1392 23.7643C64.1392 23.4559 64.4819 23.3018 65.561 23.3018C66.6917 23.3018 66.9999 23.4217 66.9999 23.7129C66.9999 23.9527 66.2633 24.2782 66.0064 24.8949C65.5439 25.9912 65.3726 26.7448 64.6189 28.5949C63.7624 30.7019 63.2143 31.4556 61.8781 31.4556C61.0217 31.4556 60.2509 31.1473 60.0111 30.4107C59.8226 29.8453 60.2165 29.3143 60.8332 29.3143C61.467 29.3143 61.7753 29.6912 61.7411 30.2393C61.6897 30.6847 61.8439 30.8731 62.1179 30.8731C62.5634 30.8731 62.8545 30.325 62.4777 29.4343C62.0666 28.4922 61.1073 26.3852 60.799 25.6657Z" fill="white" />
                <path d="M20.3615 34.5583C20.5572 34.1273 20.7923 33.6769 20.9882 33.2068C21.3409 32.4037 21.4779 32.0315 21.1645 31.7964C20.9099 31.6397 20.8315 31.4243 20.8315 31.3067C20.8315 30.9933 21.2233 30.7975 22.477 30.7975C23.6913 30.7975 23.9459 31.0325 23.9459 31.3264C23.9459 31.7769 22.9078 31.9532 22.4181 32.9521C21.7914 34.2449 21.3409 35.1851 21.0469 35.8315V38.6717C21.0469 39.3377 21.5171 39.9449 21.5171 40.3367C21.5171 40.748 20.8315 40.9438 19.7934 40.9438H19.5976C18.5594 40.9438 17.8739 40.748 17.8739 40.3367C17.8739 39.9449 18.3439 39.3377 18.3439 38.6717V36.3211C17.9521 35.3614 17.5213 34.4408 17.2862 33.9511C16.5811 32.4428 15.582 31.8945 15.582 31.4243C15.582 31.013 16.346 30.7975 17.3645 30.7975H17.678C18.7553 30.7975 19.5584 30.9346 19.5584 31.3459C19.5584 31.6594 19.3037 32.0315 19.4408 32.4037C19.5584 32.7758 19.911 33.6181 20.3615 34.5583Z" fill="white" />
                <path d="M29.0967 35.5374C28.6267 33.1476 28.0586 31.6394 27.3143 31.757C26.5699 31.8745 26.903 35.1456 27.0793 36.1838C27.4709 38.456 28.2349 40.1208 28.9401 39.9838C29.5472 39.8857 29.5472 37.7704 29.0967 35.5374ZM32.5637 35.8704C32.5637 39.1414 30.7225 41.061 28.0978 41.061C25.4731 41.061 23.6318 39.1414 23.6318 35.8704C23.6318 32.5796 25.4731 30.6797 28.0978 30.6797C30.7225 30.6797 32.5637 32.5796 32.5637 35.8704Z" fill="white" />
                <path d="M37.2263 41.041C35.0128 41.041 33.3872 40.0813 33.3872 37.0452V33.0493C33.3872 32.3834 32.917 31.7761 32.917 31.3843C32.917 30.973 33.6221 30.7771 34.6407 30.7771H34.8366C35.8748 30.7771 36.5603 30.973 36.5603 31.3843C36.5603 31.7761 36.0902 32.3834 36.0902 33.0493V37.0452C36.0902 39.0236 36.5211 39.807 37.5788 39.807C38.7149 39.807 39.0675 38.7493 39.0675 37.0452V33.0493C39.0675 32.3834 38.4407 31.7761 38.4407 31.3843C38.4407 30.973 38.9891 30.7771 39.8315 30.7771H39.9685C40.8108 30.7771 41.3788 30.973 41.3788 31.3843C41.3788 31.7761 40.752 32.3834 40.752 33.0493V37.0452C40.752 39.2782 39.8119 41.041 37.2263 41.041Z" fill="white" />
                <path d="M47.3712 34.0686C47.3712 33.0696 47.2145 31.9727 45.6475 31.9727C45.0598 31.9727 45.0598 32.1685 45.0598 33.05V35.2634C45.0598 35.8706 45.1578 36.0273 45.7063 36.0273C46.999 36.0273 47.3712 35.048 47.3712 34.0686ZM50.133 33.9902C50.133 35.1263 49.6041 36.0077 48.5856 36.5562C48.9577 37.3397 49.2124 37.9861 49.8588 38.75C50.4464 39.4551 50.8774 39.553 51.2299 39.6902C51.5433 39.8078 51.7588 39.984 51.7196 40.2191C51.6804 40.6108 51.0732 40.9438 49.9176 40.9438C48.566 40.9438 47.6258 40.4737 47.0773 39.5335C46.1371 37.9861 46.3722 37.1634 45.6083 37.1634C45.2166 37.183 45.0598 37.3592 45.0598 38.0644V38.6717C45.0598 39.3376 45.5299 39.9448 45.5299 40.3366C45.5299 40.748 44.8444 40.9438 43.8062 40.9438H43.6103C42.5918 40.9438 41.9062 40.748 41.9062 40.3366C41.9062 39.9448 42.3568 39.3376 42.3568 38.6717V33.05C42.3568 32.384 41.9062 31.7769 41.9062 31.3851C41.9062 30.9738 42.5918 30.7779 43.6103 30.7779H45.5104C48.6444 30.7779 50.133 32.051 50.133 33.9902Z" fill="white" />
                <path d="M56.9301 34.8714C59.4373 35.5374 60.2991 36.8105 60.2991 38.0445C60.2991 39.9641 58.3795 41.061 55.8527 41.061C53.6002 41.061 52.327 40.1599 51.8373 39.0239C51.3868 37.8683 51.8373 36.928 52.8754 36.8497C53.7569 36.791 54.3249 37.1827 54.462 38.2208C54.5991 39.2002 55.1867 39.8467 56.1465 39.8467C56.9496 39.8467 57.6352 39.2981 57.6352 38.4755C57.6352 37.8487 57.028 37.2219 54.9125 36.6342C53.1692 36.1054 52.2682 35.2239 52.2682 33.7353C52.2682 31.8353 53.8156 30.6992 56.1857 30.6992C57.9878 30.6992 59.0846 31.5219 59.5548 32.6188C60.0053 33.7549 59.3981 34.5383 58.3403 34.5383C57.6744 34.5383 57.0867 34.0486 56.8517 33.0889C56.6754 32.2858 56.3032 31.7374 55.8135 31.7374C55.1084 31.7374 54.8146 32.325 54.8146 32.9714C54.8146 33.6373 55.1867 34.4208 56.9301 34.8714Z" fill="white" />
                <path d="M17.3838 18.9025L18.2179 18.0222C18.2626 17.9751 18.3417 18.0078 18.34 18.0726L18.3074 19.285C18.3063 19.3256 18.3394 19.3587 18.3799 19.3577L19.5922 19.325C19.6571 19.3232 19.6899 19.4024 19.6428 19.447L18.7624 20.2811C18.733 20.309 18.733 20.3559 18.7624 20.3838L19.6428 21.218C19.6899 21.2626 19.6571 21.3417 19.5922 21.34L18.3799 21.3073C18.3394 21.3062 18.3063 21.3394 18.3074 21.3799L18.34 22.5923C18.3417 22.6571 18.2626 22.6899 18.2179 22.6428L17.3838 21.7624C17.3559 21.733 17.3091 21.733 17.2812 21.7624L16.4471 22.6428C16.4025 22.6899 16.3233 22.6571 16.3251 22.5923L16.3577 21.3799C16.3587 21.3394 16.3256 21.3062 16.2851 21.3073L15.0727 21.34C15.0079 21.3417 14.9752 21.2626 15.0222 21.218L15.9025 20.3838C15.932 20.3559 15.932 20.309 15.9025 20.2811L15.0222 19.447C14.9752 19.4024 15.0079 19.3232 15.0727 19.325L16.2851 19.3577C16.3256 19.3587 16.3587 19.3256 16.3577 19.285L16.3251 18.0726C16.3233 18.0078 16.4025 17.9751 16.4471 18.0222L17.2812 18.9025C17.3091 18.9319 17.3559 18.9319 17.3838 18.9025Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col pl-3">
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
        <div className='flex flex-wrap gap-[10px]  mt-8'>
          {facilityAvailableData.map((item, index) => (
            <div
              key={index}
              className='w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-40px)] mb-10'
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-[347px] h-[243px] object-cover"
              />
              <div className='mt-4 w-[60%] relative'>
                <h2 className='text-[20px] md:text-[26px] font-[400] leading-[24px] md:leading-[31.2px] text-[#000000] font-regola-pro'>
                  {item.title}
                </h2>
                <p className='text-[14px] md:text-[16px] font-[400] leading-[18px] md:leading-[19.2px] text-[#757575] mt-2'>
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