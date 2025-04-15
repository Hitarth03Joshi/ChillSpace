const requestModel = require('../models/requests');

const addRequest = async (req, res) => {
    try{
        const oldRequest = await requestModel.find({listingId:req.body.listingId});
        if(oldRequest.length > 0){
            for (let i=0;i<oldRequest.length;i++){
                if(oldRequest[i].message === req.body.message){
                    if(oldRequest[i].status === "pending"){
                        return res.status(400).json({ message: 'Request already exists' });
                    }
                }
            }
        }
        const { userId, listingId, message } = req.body;
        const newRequest = await requestModel.create({ userId, listingId, message });
        res.status(201).json(newRequest);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllRequests = async (req, res) => {
    try{
        const requests = await requestModel.find().populate('userId listingId');
        res.status(200).json(requests);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getRequestById = async (req, res) => {
    try{
        const { id } = req.params;
        const request = await requestModel.find({listingId:id}).populate('userId listingId');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateRequest = async (req, res) => {
    try{
        const { id } = req.params;
        const { status } = req.body;

        let updateData = { status };

        // If accepting the request, set expiration time to 1 minute from now (for testing)
        if (status === "accepted") {
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 1); // Changed from 24 hours to 1 minute
            updateData.expiresAt = expiresAt;
        }

        // If rejecting or marking as expired, remove any expiration time
        if (status === "rejected" || status === "expired") {
            updateData.expiresAt = null;
        }

        const updatedRequest = await requestModel.findByIdAndUpdate(
            id, 
            updateData,
            { new: true }
        );
        
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(updatedRequest);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteRequest = async (req, res) => {
    try{
        const { id } = req.params;
        const deletedRequest = await requestModel.findByIdAndDelete(id);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const checkExpiredRequests = async (req, res) => {
    try {
        const now = new Date();
        const expiredRequests = await requestModel.updateMany(
            {
                status: "accepted",
                expiresAt: { $lt: now }
            },
            {
                $set: { status: "expired" }
            }
        );
        res.status(200).json({ message: `${expiredRequests.modifiedCount} requests marked as expired` });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    addRequest,
    getAllRequests,
    updateRequest,
    deleteRequest,
    getRequestById,
    checkExpiredRequests
};