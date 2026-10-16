import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet'; children: ReactNode }

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  return <button className={`button button--${variant} ${className}`} {...props} />
}
