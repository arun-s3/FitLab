import React,{useEffect} from 'react'
import axios from '../../Utils/axiosConfig'

export default function AdminCustomersPage(){

    const users={}
    useEffect(()=>{
        users = axios.get('')
    })

    return(
        <section>
            <h1>Customers</h1>

            <div>
                <table>
                    <thead>
                        <tr>
                            <td colspan=''>
                                <input type='search' placeholder='Search..'/>
                            </td>
                            <td></td>
                            <td>
                                <div>
                                    <button>Status</button>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <button>Show 20</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan='5'>
                                <hr></hr>
                            </td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Mobile</td>
                            <td>Wallet</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                </table>
            </div>

        </section>
    )
}
