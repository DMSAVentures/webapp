import React from "react";

interface HeaderLogoProps {
	logo: string;
	imgSrc?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ logo, imgSrc }) => {
	return (
		<span className="header__logo">
			<a href="/" style={{ textDecoration: "none" }}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				{imgSrc ? <img src={imgSrc} alt={logo} /> : <h6>{logo}</h6>}
			</a>
		</span>
	);
};

export default HeaderLogo;
