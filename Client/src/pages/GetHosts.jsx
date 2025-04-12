import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const GetHosts = () => {

    useEffect(() => {
        getHosts()
    }, [])

    const [Hosts, setHosts] = useState([])
    const getHosts = async () => {
        try {
            const response = await fetch("http://localhost:3001/User/getallhost", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Add any other headers if needed
                },
            });
            const data = await response.json();
            console.log(data);
            setHosts(data.data) // Assuming data.data contains the hosts array
            // Handle the data as needed
        } catch (error) {
            console.error("Error fetching hosts:", error);
        }
    };
  return (
    <div>
        <h1>Get Hosts</h1>
        <table border={1}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Property List</th>
                </tr>
            </thead>
            <tbody>
                {/* Map through the hosts data and render each host's details */}
                {Hosts?.map((host) => (
                    <tr key={host._id}>
                        <td>{host.firstName} {host.lastName}</td>
                        <td>{host.email}</td>
                        <td>
                            <ul>
                                {host.propertyList.map((property) => (
                                    <li>
                                        {property.title} - {property.description}
                                        <Link to={`/properties/${property._id}`}>View</Link>
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}
