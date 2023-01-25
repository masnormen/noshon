import cn from '../lib/cn';

type UtilButtonProps = {
  children: JSX.Element | string;
  className?: string;
  [key: string]: any;
};

const UtilButton = ({ children, className, ...props }: UtilButtonProps): JSX.Element => (
  <button className={cn('rounded-md bg-white px-3 py-1 hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-300', className)} {...props}>
    {children}
  </button>
);

export default UtilButton;