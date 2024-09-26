import appConfig from '@cfce/app-config';
import Image from 'next/image';
import React from 'react';

const Logo = () => {
  const logoLight = `${appConfig.siteInfo.logo?.light ?? 'logo.png'}`;
  const logoDark = `${appConfig.siteInfo.logo?.dark ?? 'logoWhite.png'}`;

  return (
    <div className="w-60 lg:w-80 h-20 relative">
      <Image
        src={logoLight}
        alt={`${appConfig.siteInfo.title} logo`}
        fill
        className="object-contain dark:hidden"
      />
      <Image
        src={logoDark}
        alt={`${appConfig.siteInfo.title} logo`}
        fill
        className="object-contain hidden dark:block"
      />
    </div>
  );
};

export default Logo;
