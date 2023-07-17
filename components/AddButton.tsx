import React, {useState} from 'react'
import Modal from 'react-modal'

import {CreateClientForm} from '@/components/CreateClientForm'

Modal.setAppElement('#modal')

export function AddButton() {
  const [isModalOpen, setIsOpen] = useState(false)
  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <button
        className="mx-5"
        onClick={() => openModal()}
        title="Create a client"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="h-9 w-9"
          viewBox="0 0 16 16"
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="rounded-xl bg-white p-8"
      >
        <CreateClientForm />
      </Modal>
    </>
  )
}
