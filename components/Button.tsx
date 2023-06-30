import {cva, VariantProps} from 'class-variance-authority'
import React, {FC} from 'react'

const buttonClasses = cva(
  [
    'focus:ring-opacity-50',
    'focus:outline-none',
    'focus:ring',
    'transform',
    'rounded-lg',
    'capitalize',
    'tracking-wide',
    'text-white',
    'transition-colors',
    'duration-300',
    'disabled:cursor-wait',
  ],
  {
    variants: {
      intent: {
        primary: ['bg-blue-600', 'hover:bg-blue-500', 'focus:ring-blue-300'],
        danger: ['bg-red-500', 'hover:bg-red-400', 'focus:ring-red-300'],
        success: [
          'bg-emerald-500',
          'hover:bg-emerald-400',
          'focus:ring-emerald-300',
        ],
        warning: [
          'bg-yellow-500',
          'hover:bg-yellow-400',
          'focus:ring-yellow-300',
        ],
      },
      size: {
        medium: ['text-md', 'font-medium', 'px-6', 'py-2'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
    },
  },
)

interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonClasses> {}

const Button: FC<ButtonProps> = ({
  children,
  className,
  intent,
  size,
  ...props
}) => {
  return (
    <button className={buttonClasses({intent, size, className})} {...props}>
      {children}
    </button>
  )
}

export default Button
