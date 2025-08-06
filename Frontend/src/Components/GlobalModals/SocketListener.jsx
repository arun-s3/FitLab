import React, { useEffect } from "react";
import {Outlet} from 'react-router-dom'
import { useModal } from "./ModalContext";

import {SocketContext} from '../../Components/SocketProvider/SocketProvider'

import VideoCallModal from "../../Pages/User/VideoCallCommonModal/VideoCallCommonModal";

const SocketListener = ({children}) => {
  const { openModal } = useModal();

  // useEffect(() => {
    // const handleOpenModal = (data) => {
    //   openModal(<p>Session scheduled: {data.sessionId}</p>);
    // };

  //   socket.on("openModal", handleOpenModal);

  //   return () => {
  //     socket.off("openModal", handleOpenModal); // Clean up
  //   };
  // }, []);
   const {socket} = useContext(SocketContext)
  

    useEffect(()=> {
        if(socket){

          const handleOpenModal = () => {
            openModal(<VideoCallModal/>)
          }

          socket.on("notifySupportCalling", (sessionId) => {
            console.log("Inside on notifySupportCalling....")
            handleOpenModal()
            // setOpenVideoCallModal(true)
          })

          return ()=> {
            socket.off("notifySupportCalling")
          }
        }
    }, [socket])

  return (
    {children}
  ) 
};

export default SocketListener;
