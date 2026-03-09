import React, { useEffect } from "react"
import { useModal } from "./ModalContext"

import { SocketContext } from "../../Socket-providers/SocketProvider/SocketProvider"

import VideoCallModal from "../../Features/VideoChat/VideoCallCommonModal/VideoCallCommonModal"


const SocketListener = ({ children }) => {
    
    const { openModal } = useModal()

    const { socket } = useContext(SocketContext)

    useEffect(() => {
        if (socket) {
            const handleOpenModal = () => {
                openModal(<VideoCallModal />)
            }

            socket.on("notifySupportCalling", (sessionId) => {
                handleOpenModal()
            })

            return () => {
                socket.off("notifySupportCalling")
            }
        }
    }, [socket])

    return { children }
}

export default SocketListener
