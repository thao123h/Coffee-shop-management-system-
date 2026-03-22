'use client'
import { Toaster as Sonner } from 'sonner'

export function Toaster({ ...props }) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={{
          '--normal-bg': 'white',
          '--normal-text': 'black',
          '--normal-border': '#e2e8f0',
      }}
      {...props}
    />
  )
}
