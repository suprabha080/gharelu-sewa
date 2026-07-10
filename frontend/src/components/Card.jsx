import React from 'react';
import clsx from 'clsx';

export const Card = ({
  children,
  className,
  shadow = 'md',
  padding = 'md',
  ...props
}) => {
  const shadows = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: '',
  };

  const paddings = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  };

  return (
    <div
      className={clsx(
        'rounded-lg bg-white',
        shadows[shadow],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('mb-4 pb-4 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={clsx('text-2xl font-bold text-gray-900', className)} {...props}>
    {children}
  </h2>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={clsx('text-gray-600 text-sm mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('mt-6 pt-4 border-t border-gray-200 flex gap-3', className)} {...props}>
    {children}
  </div>
);

export default Card;
