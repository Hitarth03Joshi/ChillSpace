import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const RequestsPage = () => {

    const [requests, setrequests] = useState()

    useEffect(() => {
        getAllRequests()
    }, [])

    const getAllRequests = async () => {
        try {
            const res = await axios.get('http://localhost:3001/requests/all')
            res.data = res.data.filter((request) => request.status === "pending")
            if(res.data.filter((request) => request.status === "pending")){
                setrequests(res.data);
            }else{
                alert("No Requests Found")
            }
        } catch (err) {
            console.log("Fetch Requests Failed", err.message);
        }
    }

    const handleAccept = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:3001/requests/update/${id}`, { status: "accepted" })
            if (res.status === 200) {
                alert("Request Accepted")
                getAllRequests()
            }
        } catch (err) {
            console.log("Accept Request Failed", err.message)
        }
    }

    const handleReject = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:3001/requests/update/${id}`, { status: "rejected" })
            if (res.status === 200) {
                alert("Request Rejected")
                getAllRequests()
            }
        } catch (err) {
            console.log("Reject Request Failed", err.message)
        }
    }

    return (
        <div style={{textAlign: "center"}}>
            <h1>Requests Page</h1>
            <p>This is the requests page.</p>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Property List</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through the hosts data and render each host's details */}
                    {requests?.map((request) => (
                        <tr key={request.userId._id}>
                            <td>{request.userId.firstName} {request.userId.lastName}</td>
                            <td>{request.userId.email}</td>
                            <td>
                                <ul>
                                    {/* {requests.map((property) => ( */}
                                        <li key={request.listingId._id}>
                                            {request.listingId.title} - {request.listingId.description}
                                            <Link to={`/properties/${request.listingId._id}`}>View</Link>
                                        </li>
                                    {/* ))} */}
                                </ul>
                            </td>
                            <td>{request.message}</td>
                            <td>
                                <button onClick={() => handleUpdate(request._id)}>Update</button>
                                <button onClick={() => handleDelete(request._id)}>Delete</button>
                                <button onClick={() => handleAccept(request._id)}>Accept</button>
                                <button onClick={() => handleReject(request._id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
