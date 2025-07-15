import { Slack } from 'lucide-react';
import React from 'react';

interface LogoSvgProps {
  name?: string;
}

const LogoSvg: React.FC<LogoSvgProps> = ({ name = 'Nexify Store' }) => {
  return (
    <p className='flex gap-2 items-center'>
      <Slack color='#2C73D2' />
      <span className='text-[#2C73D2] text-base-bold'>{name}</span>
    </p>
  );
};

export default LogoSvg;
