'use client'
import './globals.css'
import { Inter } from 'next/font/google'

import { Provider } from 'react-redux'
import store from "@/redux/store"
import Modal from '@/components/Modal/Modal'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen"}>
        <Provider store={store}>
          <Modal />
          {children}
        </Provider>
      </body>
    </html>
  )
}
