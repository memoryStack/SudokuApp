import { useContext } from 'react'

import ModalContext from 'src/contexts/ModalContext'

export const useModal = () => useContext(ModalContext)
