'use client'

import {SessionProvider} from 'next-auth/react'
import React from 'react'
import {Provider} from 'react-redux'
import {ToastContainer} from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import {store} from '@/redux/store'

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
        <ToastContainer />
      </Provider>
    </SessionProvider>
  )
}
