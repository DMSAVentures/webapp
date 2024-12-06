import React from 'react';
import Link from "next/link";

interface HeaderLogoProps {
    logo: string;
    imgSrc?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ logo, imgSrc }) => {
    return (
        <span className="header__logo">
            <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {imgSrc ? <img src={imgSrc} alt={logo} /> : logo}
            </Link>
        </span>
    );
};

export default HeaderLogo;
