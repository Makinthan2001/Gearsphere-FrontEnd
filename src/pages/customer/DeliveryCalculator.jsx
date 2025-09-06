import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeliveryCalculator = ({ cartTotal, onDeliveryUpdate }) => {
    const [userAddress, setUserAddress] = useState('');
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [newAddress, setNewAddress] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Sri Lankan districts with delivery charges
    const districts = [
        { name: 'Colombo', charge: 500, areas: ['colombo', 'nugegoda', 'maharagama', 'kotte', 'dehiwala', 'mount lavinia', 'rajagiriya', 'battaramulla'] },
        { name: 'Gampaha', charge: 700, areas: ['gampaha', 'negombo', 'kelaniya', 'ja-ela', 'wattala', 'kadawatha'] },
        { name: 'Kalutara', charge: 900, areas: ['kalutara', 'panadura', 'beruwala', 'aluthgama'] },
        { name: 'Kandy', charge: 800, areas: ['kandy', 'peradeniya', 'gampola', 'katugastota'] },
        { name: 'Matale', charge: 1000, areas: ['matale', 'dambulla', 'sigiriya'] },
        { name: 'Nuwara Eliya', charge: 1200, areas: ['nuwara eliya', 'hatton', 'talawakelle', 'nanu oya'] },
        { name: 'Galle', charge: 1500, areas: ['galle', 'hikkaduwa', 'unawatuna', 'bentota'] },
        { name: 'Matara', charge: 1500, areas: ['matara', 'mirissa', 'weligama', 'tangalle'] },
        { name: 'Hambantota', charge: 1500, areas: ['hambantota', 'tissamaharama', 'kataragama'] },
        { name: 'Kurunegala', charge: 1300, areas: ['kurunegala', 'puttalam', 'chilaw', 'wariyapola'] },
        { name: 'Anuradhapura', charge: 1700, areas: ['anuradhapura', 'mihintale'] },
        { name: 'Polonnaruwa', charge: 1700, areas: ['polonnaruwa'] },
        { name: 'Ratnapura', charge: 1400, areas: ['ratnapura', 'embilipitiya'] },
        { name: 'Kegalle', charge: 1400, areas: ['kegalle', 'mawanella'] },
        { name: 'Badulla', charge: 1600, areas: ['badulla', 'bandarawela', 'ella'] },
        { name: 'Monaragala', charge: 1600, areas: ['monaragala', 'wellawaya'] },
        { name: 'Ampara', charge: 1900, areas: ['ampara', 'kalmunai'] },
        { name: 'Batticaloa', charge: 1900, areas: ['batticaloa'] },
        { name: 'Trincomalee', charge: 1900, areas: ['trincomalee', 'kattankudy'] },
        { name: 'Jaffna', charge: 2200, areas: ['jaffna', 'point pedro'] },
        { name: 'Mannar', charge: 2200, areas: ['mannar'] },
        { name: 'Vavuniya', charge: 2200, areas: ['vavuniya'] },
        { name: 'Kilinochchi', charge: 2200, areas: ['kilinochchi'] },
        { name: 'Mullaitivu', charge: 2200, areas: ['mullaitivu'] }
    ];

    // Helper function to get district from address
    const getDistrictFromAddress = (address) => {
        const addr = address.toLowerCase();
        for (const district of districts) {
            if (district.areas.some(area => addr.includes(area))) {
                return district.name;
            }
        }
        return '';
    };

    // Delivery rates for Sri Lankan cities (in LKR)
    const getDeliveryCharge = (address) => {
        const addr = address.toLowerCase();
        
        for (const district of districts) {
            if (district.areas.some(area => addr.includes(area))) {
                return district.charge;
            }
        }
        
        // Default charge for unrecognized areas
        return 1500;
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (userAddress && cartTotal > 0) {
            calculateDelivery();
        }
    }, [userAddress, cartTotal]);

    const fetchUserSession = async () => {
        try {
            const sessionResponse = await axios.get(
                "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
                { withCredentials: true }
            );
            if (sessionResponse.data.success) {
                setUserId(sessionResponse.data.user_id);
                fetchUserAddress();
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    const fetchUserAddress = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost/gearsphere_api/GearSphere-BackEnd/getCustomer.php`, {
                withCredentials: true
            });
            // Original getCustomer.php returns the user data directly
            if (response.data) {
                setUserAddress(response.data.address || '');
                setUserId(response.data.user_id || response.data.id || null);
            }
        } catch (error) {
            console.error('Error fetching user address:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressUpdate = async () => {
        if (!selectedDistrict || !newAddress.trim()) {
            toast.error('Please fill in both district and address fields.');
            return;
        }

        if (!userId) {
            toast.error('User ID not found. Please refresh the page and try again.');
            return;
        }

        try {
            const fullAddress = `${newAddress.trim()}, ${selectedDistrict}`;
            
            // Send simple address-only update
            const updateData = {
                user_id: userId,
                address: fullAddress
            };
            
            const response = await axios.post(`http://localhost/gearsphere_api/GearSphere-BackEnd/updateCustomerProfile.php`, updateData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.data.success) {
                setUserAddress(fullAddress);
                setNewAddress('');
                setSelectedDistrict('');
                
                // Close the modal
                setShowModal(false);
                
                // Recalculate delivery
                calculateDelivery();
                
                toast.success('Address updated successfully!');
            } else {
                console.error('Update failed:', response.data);
                toast.error(`Failed to update address: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating address:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(`Error updating address: ${error.response.data.message || error.message}`);
            } else {
                toast.error('Network error. Please check your connection and try again.');
            }
        }
    };

    const calculateDelivery = () => {
        if (!userAddress) {
            setDeliveryCharge(0);
            return;
        }

        const charge = getDeliveryCharge(userAddress);
        
        setDeliveryCharge(charge);
        
        onDeliveryUpdate && onDeliveryUpdate({
            deliveryCharge: charge,
            address: userAddress
        });
    };

    const formatCurrency = (amount) => {
        return `Rs. ${amount.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    <span>Loading delivery information...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                🚚 Delivery Information
            </h3>

            {!userAddress ? (
                <div className="alert alert-warning">
                    <p className="mb-2"><strong>⚠️ Address Required</strong></p>
                    <p className="mb-3">Please update your address in profile to calculate delivery charges.</p>
                    <button 
                        onClick={() => window.location.href = '/customer/profile'}
                        className="btn btn-warning"
                    >
                        Update Address
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Address Display */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium mb-1">📍 Delivery Address:</p>
                        <p className="text-gray-800">{userAddress}</p>
                        <button 
                            type="button"
                            className="btn btn-outline-primary btn-sm mt-2"
                            onClick={() => setShowModal(true)}
                        >
                            Change Address
                        </button>
                    </div>

                    {/* Delivery Calculation */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-gray-800 mb-3">💰 Delivery Calculation</h4>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cart Total:</span>
                                <span className="font-medium">{formatCurrency(cartTotal)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Charge:</span>
                                <span className="font-medium text-blue-600">{formatCurrency(deliveryCharge)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total with Delivery:</span>
                                <span className="text-success">{formatCurrency(cartTotal + deliveryCharge)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={calculateDelivery}
                        className="btn btn-primary w-100"
                    >
                        🔄 Recalculate Delivery
                    </button>
                </div>
            )}

            {/* Address Change Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Delivery Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>District *</Form.Label>
                            <Form.Select 
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                required
                            >
                                <option value="">Select District</option>
                                <option value="Colombo">Colombo</option>
                                <option value="Gampaha">Gampaha</option>
                                <option value="Kalutara">Kalutara</option>
                                <option value="Kandy">Kandy</option>
                                <option value="Matale">Matale</option>
                                <option value="Nuwara Eliya">Nuwara Eliya</option>
                                <option value="Galle">Galle</option>
                                <option value="Matara">Matara</option>
                                <option value="Hambantota">Hambantota</option>
                                <option value="Jaffna">Jaffna</option>
                                <option value="Kilinochchi">Kilinochchi</option>
                                <option value="Mannar">Mannar</option>
                                <option value="Vavuniya">Vavuniya</option>
                                <option value="Mullaitivu">Mullaitivu</option>
                                <option value="Batticaloa">Batticaloa</option>
                                <option value="Ampara">Ampara</option>
                                <option value="Trincomalee">Trincomalee</option>
                                <option value="Kurunegala">Kurunegala</option>
                                <option value="Puttalam">Puttalam</option>
                                <option value="Anuradhapura">Anuradhapura</option>
                                <option value="Polonnaruwa">Polonnaruwa</option>
                                <option value="Badulla">Badulla</option>
                                <option value="Moneragala">Moneragala</option>
                                <option value="Ratnapura">Ratnapura</option>
                                <option value="Kegalle">Kegalle</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Address *</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Enter your complete address including house number, street, city, etc." 
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleAddressUpdate}>
                        Update Address
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DeliveryCalculator;
