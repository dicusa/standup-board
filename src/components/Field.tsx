import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

type Shared = { id: string; label: string; hint?: string; children?: ReactNode }
type Props = Shared & ({ as?: 'input'; inputProps?: InputHTMLAttributes<HTMLInputElement> } | { as: 'textarea'; inputProps?: TextareaHTMLAttributes<HTMLTextAreaElement> })

export function Field({ id, label, hint, as = 'input', inputProps }: Props) {
  return <div className="field"><label htmlFor={id}>{label}</label>{hint && <span className="field__hint" id={`${id}-hint`}>{hint}</span>}{as === 'textarea' ? <textarea id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>} /> : <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...inputProps as InputHTMLAttributes<HTMLInputElement>} />}</div>
}
