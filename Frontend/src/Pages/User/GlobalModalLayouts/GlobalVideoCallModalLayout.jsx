import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'

import { SocketContext } from '../../../Components/SocketProvider/SocketProvider'
import VideoCallCommonModal from '../\/VideoCallCommonModal/VideoCallCommonModal'


export default function GlobalVideoCallModalLayout() {
    
  const { openVideoCallModal, setOpenVideoCallModal, videoSessionInfo } = useContext(SocketContext)

  return (
    <>
      {openVideoCallModal && (
        <VideoCallCommonModal videoSessionInfo={videoSessionInfo} onClose={() => setOpenVideoCallModal(false)} />
      )}
      <Outlet />
    </>
  )
}
