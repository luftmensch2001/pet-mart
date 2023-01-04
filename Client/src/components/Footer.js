import React from 'react';
import './Footer.css';

import { TiSocialFacebookCircular, TiSocialInstagram, TiSocialTwitterCircular, TiSocialYoutubeCircular } from "react-icons/ti";
import { FiPhoneCall, FiMail, FiMapPin, FiClock } from "react-icons/fi";

function Footer() {
    return (
        <div className='Footer'>
            <div className='footer-container content'>
                <div className='footer-contact'>
                    <span className='title-text'>E-Mart</span>
                    <div className='footer-social'>
                            <TiSocialFacebookCircular className='footer-social-icon'/>
                            <TiSocialInstagram className='footer-social-icon'/>
                            <TiSocialTwitterCircular className='footer-social-icon'/>
                            <TiSocialYoutubeCircular className='footer-social-icon'/>
                    </div>
                    <div className='footer-info'>
                        <FiPhoneCall className='footer-icon' />
                        <span className='footer-text'>(+84) 935 0032 14</span>
                    </div>
                    <div className='footer-info'>
                        <FiMail className='footer-icon' />
                        <span className='footer-text'>e-mart@gmail.com</span>
                    </div>
                    <div className='footer-info'>
                        <FiMapPin className='footer-icon' />
                        <span className='footer-text'>UIT, Phường Linh Xuân, Thành phố Thủ Đức</span>
                    </div>
                    <div className='footer-info'>
                        <FiClock className='footer-icon' />
                        <span className='footer-text'>8:00 AM - 17:00 PM</span>
                    </div>
                </div>

                <div className='footer-col'>
                    <span className='footer-col-title'>Công ty</span>
                    <a className='footer-col-link' href='#'>Về chúng tôi</a>
                    <a className='footer-col-link' href='#'>Chính sách</a>
                    <a className='footer-col-link' href='#'>Dịch vụ</a>
                    <a className='footer-col-link' href='#'>Tuyển dụng</a>
                    <a className='footer-col-link' href='#'>Liên hệ</a>
                </div>
                <div className='footer-col'>
                    <span className='footer-col-title'>Tài khoản</span>
                    <a className='footer-col-link' href='#'>Giỏ hàng</a>
                    <a className='footer-col-link' href='#'>Yêu thích</a>
                    <a className='footer-col-link' href='#'>Tra cứu đơn mua</a>
                    <a className='footer-col-link' href='#'>Tra cứu đơn bán</a>
                    <a className='footer-col-link' href='#'>Đăng xuất</a>
                </div>
                <div className='footer-col'>
                    <span className='footer-col-title'>Đăng ký nhận thông tin</span>
                    <input type='email' className='footer-input' placeholder='Địa chỉ e-mail'/>
                    <input type='number' className='footer-input'placeholder='Số điện thoại' />
                    <button className='footer-subsribe-button'>Đăng ký</button>
                </div>
            </div>
            <div className='footer-copyright-container content'>
                <span className='footer-copyright-text'>Copyright © 2022 <span className='green-text'>UIT</span>. All Right Reserved.</span>
                <div className='footer-copyright-contact'>
                        <FiMail className='footer-copyright-icon' />
                        <span className='footer-copyright-text'>19520230@gm.uit.edu.vn</span>
                </div>
                <span className='footer-copyright-text'>Made By <span className='green-text'>Phuong & Tam</span> From UIT.</span>
            </div>
        </div>
    )
}

export default Footer