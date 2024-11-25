import React from 'react'

import AdminHeader from '../../../Components/AdminHeader/AdminHeader'


export default function AdminDashboardPage(){

    return(
        // <h1 className='mt-[5rem] text-center text-[20px]'> Admin Dashboard </h1>
        <section id='adminDashboard'>
            <header>
                <AdminHeader heading='Dashboard' subHeading='Manage, Monitor, and Optimize Your E-commerce Platform'/>
            </header>
        </section>
    )
}