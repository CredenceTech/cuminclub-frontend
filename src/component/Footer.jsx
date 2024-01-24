import React from 'react'
import { Link } from 'react-router-dom';

const divFooterStyle = {
    backgroundImage: 'url("src/assets/Footer.svg")',
    backgroundSize: 'cover',
    width: '100%',
    height: '15vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
};

const divStyle = {
    display: 'flex',
    // justifyContent: 'flex-start',
    width: '100%',
    //  padding: '20px',
    //  marginTop: '30px',
    paddingTop: '50px',
    fontSize: 14
};

const divStyle1 = {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingRight: '20px'
};

const divStyle2 = {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingLeft: '20px',
    marginLeft: '650px'
};

const linkStyle1 = {
    paddingRight: '40px',
}

const linkStyle2 = {
    //   paddingRight: '20px',
}

const instantlyStyle = {
    ...linkStyle2,
    color: '#80BC42'
}


const Footer = () => {
    return (
        <div>
            <div style={divFooterStyle} >
                <div style={divStyle} >
                    <div style={divStyle1}>
                        <a className='text-lime-50' style={linkStyle1}>Terms & Conditions</a>
                        <a className='text-lime-50' style={linkStyle1}>Privacy Policy</a>
                        <a className='text-lime-50' style={linkStyle1}>Refunds</a>
                        <a className='text-lime-50' style={linkStyle1}>Affiliate Program</a>
                    </div>
                    <div style={divStyle2}>
                        <span className='text-lime-50' style={linkStyle2}>Copyright © 2023</span>
                        <span className='text-lime-50' style={instantlyStyle}>Instantly Yours.</span>
                        <span className='text-lime-50' style={linkStyle2}>All Rights Reserved.</span>
                    </div>
                </div>
            </div>
        </div>
        // <div className="Footer" style={{ width: 1500, height: 93, position: 'relative' }}>
        //     <div className="Rectangle8" style={{ width: 1440, height: 55, left: 30, top: 38, position: 'absolute', background: '#243F2F' }} />
        //     <div className="Frame" style={{ width: 1500, height: 54.19, paddingTop: 1.18, paddingBottom: 0.09, paddingLeft: 6.94, paddingRight: 5.62, left: 1500, top: 0, position: 'absolute', transform: 'rotate(180deg)', transformOrigin: '0 0', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
        //         <div className="Vector" style={{ width: 1487.44, height: 52.91, background: '#80BC42' }}></div>
        //     </div>
        //     <div className="Frame" style={{ width: 1500, height: 54.19, paddingTop: 1.18, paddingBottom: 0.09, paddingLeft: 6.94, paddingRight: 5.62, left: 0, top: 1, position: 'absolute', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
        //         <div className="Vector" style={{ width: 1487.44, height: 52.91, background: '#243F2F' }}></div>
        //     </div>
        //     <div className="TermsConditionsPrivacyPolicyRefundsAffiliateProgram" style={{ left: 55, top: 61, position: 'absolute', color: 'white', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word' }}>
        //         Terms & Conditions
        //         Privacy Policy
        //         Refunds
        //         Affiliate Program
        //     </div>
        //     <div className="Copyright2023InstantlyYoursAllRightsReserved" style={{ left: 1085, top: 61, position: 'absolute' }}>
        //         <span style="color: 'white', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word'">
        //             Copyright © 2023
        //         </span>
        //         <span style="color: '#80BC42', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word'">
        //             Instantly Yours
        //         </span>
        //         <span style="color: 'white', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: '600', wordWrap: 'break-word'">
        //             All Rights Reserved.
        //         </span>
        //     </div>
        // <div className="Copyright2023InstantlyYoursAllRightsReserved"><span style="text-white text-sm font-semibold font-['Plus Jakarta Sans']">Copyright © 2023 </span><span style="text-lime-500 text-sm font-semibold font-['Plus Jakarta Sans']">Instantly Yours</span><span style="text-white text-sm font-semibold font-['Plus Jakarta Sans']">. All Rights Reserved.</span></div>

        // </div>
    )
}

export default Footer