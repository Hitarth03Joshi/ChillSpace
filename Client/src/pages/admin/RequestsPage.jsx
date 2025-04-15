import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Requests.scss'

const RequestsPage = () => {

    const [requests, setrequests] = useState()
    const [filterStatus, setFilterStatus] = useState("all")
    const [countdowns, setCountdowns] = useState({})

    useEffect(() => {
        getAllRequests()
    }, [])

    // Update countdowns every second
    useEffect(() => {
        if (!requests) return;
        
        const interval = setInterval(() => {
            const now = new Date();
            const newCountdowns = {};
            
            requests.forEach(request => {
                if (request.status === "accepted" && request.expiresAt) {
                    const expiryDate = new Date(request.expiresAt);
                    const diffMs = expiryDate - now;
                    
                    if (diffMs > 0) {
                        const diffSec = Math.floor(diffMs / 1000);
                        const diffMin = Math.floor(diffSec / 60);
                        const remainingSec = diffSec % 60;
                        newCountdowns[request._id] = `${diffMin}:${remainingSec < 10 ? '0' : ''}${remainingSec}`;
                    } else {
                        newCountdowns[request._id] = "Expired";
                    }
                }
            });
            
            setCountdowns(newCountdowns);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [requests]);

    const getAllRequests = async () => {
        try {
            const res = await axios.get('http://localhost:3001/requests/all')
            // Don't filter initially, show all requests
            setrequests(res.data);
        } catch (err) {
            console.log("Fetch Requests Failed", err.message);
        }
    }

    const filteredRequests = requests?.filter(request => 
        filterStatus === "all" ? true : request.status === filterStatus
    )
    
    const handleAccept = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:3001/requests/update/${id}`, { status: "accepted" })
            if (res.status === 200) {
                alert("Request Accepted - Will expire in 1 minute")
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

    const handleExpire = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:3001/requests/update/${id}`, { status: "expired" })
            if (res.status === 200) {
                alert("Request marked as expired")
                getAllRequests()
            }
        } catch (err) {
            console.log("Expire Request Failed", err.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:3001/requests/delete/${id}`)
            if (res.status === 200) {
                alert("Request deleted")
                getAllRequests()
            }
        } catch (err) {
            console.log("Delete Request Failed", err.message)
        }
    }

    const handleCheckExpired = async () => {
        try {
            const res = await axios.get('http://localhost:3001/requests/check-expired')
            if (res.status === 200) {
                alert(res.data.message)
                getAllRequests()
            }
        } catch (err) {
            console.log("Check Expired Requests Failed", err.message)
        }
    }

    return (
        <div className="requests-page">
            <h1>Requests Page</h1>
            
            <div className="action-buttons">
                <button onClick={handleCheckExpired} className="check-expired-btn">
                    Check for Expired Requests
                </button>
            </div>
            
            {/* Add status filter buttons */}
            <div className="status-filters">
                <button 
                    onClick={() => setFilterStatus("all")}
                    className={filterStatus === "all" ? "active" : ""}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilterStatus("pending")}
                    className={filterStatus === "pending" ? "active" : ""}
                >
                    Pending
                </button>
                <button 
                    onClick={() => setFilterStatus("accepted")}
                    className={filterStatus === "accepted" ? "active" : ""}
                >
                    Accepted
                </button>
                <button 
                    onClick={() => setFilterStatus("rejected")}
                    className={filterStatus === "rejected" ? "active" : ""}
                >
                    Rejected
                </button>
                <button 
                    onClick={() => setFilterStatus("expired")}
                    className={filterStatus === "expired" ? "active" : ""}
                >
                    Expired
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Property</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Request Date</th>
                        <th>Expiry Date</th>
                        <th>Time Left</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests?.map((request) => (
                        <tr key={request._id}>
                            <td>{request.userId.firstName} {request.userId.lastName}</td>
                            <td>{request.userId.email}</td>
                            <td>
                                <Link to={`/properties/${request.listingId._id}`}>
                                    {request.listingId.title}
                                </Link>
                            </td>
                            <td>{request.message}</td>
                            <td>
                                <span className={`status-${request.status}`}>
                                    {request.status}
                                </span>
                            </td>
                            <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                            <td>
                                {request.expiresAt ? 
                                    new Date(request.expiresAt).toLocaleDateString() + ' ' + 
                                    new Date(request.expiresAt).toLocaleTimeString() : 
                                    'N/A'}
                            </td>
                            <td>
                                {request.status === "accepted" && countdowns[request._id] ? 
                                    <span className="countdown">{countdowns[request._id]}</span> : 
                                    'N/A'}
                            </td>
                            <td>
                                {request.status === "pending" && (
                                    <>
                                        <button onClick={() => handleAccept(request._id)}>Accept</button>
                                        <button onClick={() => handleReject(request._id)}>Reject</button>
                                    </>
                                )}
                                {request.status === "accepted" && (
                                    <button onClick={() => handleExpire(request._id)}>Mark as Expired</button>
                                )}
                                <button onClick={() => handleDelete(request._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RequestsPage;
