import { Icon as Iconify } from '@iconify/react';
import registry, { IconName } from './icons-registry';
import { cn } from '@/lib/utils';

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
};

export default function Icon({ name, size = 18, className, ...rest }: IconProps) {
  return (
    <Iconify
      icon={registry[name]}
      width={size}
      height={size}
      className={cn(
        'align-middle text-[#E7E7F4] icon-soft',
        className
      )}
      {...rest}
    />
  );
}
