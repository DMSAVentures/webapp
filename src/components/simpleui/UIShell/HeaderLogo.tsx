import React from 'react';
import Link from "next/link";

interface HeaderLogoProps {
    logo: string;
    imgSrc?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ logo }) => {
    return (
        <span className="header__logo">
            <Link href="/">
                {logo}
            </Link>
        </span>
    );
};

export default HeaderLogo;
