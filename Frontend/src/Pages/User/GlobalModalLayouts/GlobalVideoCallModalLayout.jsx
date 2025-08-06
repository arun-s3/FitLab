import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'

import { SocketContext } from '../../../Components/SocketProvider/SocketProvider'
import VideoCallCommonModal from '../\/VideoCallCommonModal/VideoCallCommonModal'


export default function GlobalVideoCallModalLayout() {
    
  const { openVideoCallModal, setOpenVideoCallModal } = useContext(SocketContext)

  return (
    <>
      {openVideoCallModal && (
        <VideoCallCommonModal onClose={() => setOpenVideoCallModal(false)} />
      )}
      <Outlet />
    </>
  )
}
