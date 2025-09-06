import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeliveryCalculator = ({ cartTotal, onDeliveryUpdate }) => {
    const [userAddress, setUserAddress] = useState('');
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [newAddress, setNewAddress] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);

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
        if (!address) return null;
        
        const addressLower = address.toLowerCase();
        
        for (const district of districts) {
            // Check if district name is in address
            if (addressLower.includes(district.name.toLowerCase())) {
                return district;
            }
            
            // Check if any area in the district is mentioned
            for (const area of district.areas) {
                if (addressLower.includes(area.toLowerCase())) {
                    return district;
                }
            }
        }
        
        return null;
    };

    // Format currency
    const formatCurrency = (amount) => {
        // Handle undefined, null, or NaN values
        if (amount === undefined || amount === null || isNaN(amount)) {
            return 'Rs. 0';
        }
        // Ensure amount is a number
        const numAmount = Number(amount);
        if (isNaN(numAmount)) {
            return 'Rs. 0';
        }
        return `Rs. ${numAmount.toLocaleString()}`;
    };

    // Fetch user session on component mount
    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await axios.get('http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php', {
                    withCredentials: true
                });
                
                if (response.data.success === true) {
                    setUserId(response.data.user_id);
                } else {
                    console.error('Session not found:', response.data);
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
            }
        };

        fetchUserSession();
    }, []);

    // Calculate delivery charge when address changes
    useEffect(() => {
        if (userAddress) {
            const district = getDistrictFromAddress(userAddress);
            if (district) {
                setDeliveryCharge(district.charge);
                // Safely call onDeliveryUpdate if it exists
                if (onDeliveryUpdate && typeof onDeliveryUpdate === 'function') {
                    onDeliveryUpdate({
                        deliveryCharge: district.charge,
                        address: userAddress
                    });
                }
            } else {
                // Default delivery charge for unknown areas
                setDeliveryCharge(1000);
                if (onDeliveryUpdate && typeof onDeliveryUpdate === 'function') {
                    onDeliveryUpdate({
                        deliveryCharge: 1000,
                        address: userAddress
                    });
                }
            }
        } else {
            setDeliveryCharge(0);
            if (onDeliveryUpdate && typeof onDeliveryUpdate === 'function') {
                onDeliveryUpdate({
                    deliveryCharge: 0,
                    address: ''
                });
            }
        }
    }, [userAddress, onDeliveryUpdate]);

    // Handle address update
    const handleAddressUpdate = async () => {
        if (!selectedDistrict || !newAddress.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!userId) {
            toast.error('User session not found');
            return;
        }

        setLoading(true);
        
        try {
            const fullAddress = `${newAddress.trim()}, ${selectedDistrict}`;

            // Set the delivery address for this order (no API call needed for user profile update)
            setUserAddress(fullAddress);
            setShowAddressForm(false);
            setNewAddress('');
            setSelectedDistrict('');
            toast.success('Delivery address set successfully!');
            
        } catch (error) {
            console.error('Error setting delivery address:', error);
            toast.error('Failed to set delivery address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle change address button click
    const handleChangeAddress = () => {
        if (userAddress) {
            // Pre-populate form with existing address
            const addressParts = userAddress.split(', ');
            if (addressParts.length >= 2) {
                const district = addressParts[addressParts.length - 1];
                const address = addressParts.slice(0, -1).join(', ');
                setSelectedDistrict(district);
                setNewAddress(address);
            }
        }
        setShowAddressForm(true);
    };

    // Handle cancel form
    const handleCancelForm = () => {
        setNewAddress('');
        setSelectedDistrict('');
        setShowAddressForm(false);
    };

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-3 shadow border w-100" style={{borderRadius: '15px', minWidth: '100%'}}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Calculating delivery charge...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-3 shadow border w-100" style={{borderRadius: '15px', minWidth: '100%'}}>
            <h3 className="h5 fw-bold mb-3 d-flex align-items-center text-dark">
                🚚 Delivery Information
            </h3>

            {!userAddress && !showAddressForm ? (
                <div className="alert alert-info">
                    <p className="mb-2"><strong>📍 Set Delivery Address</strong></p>
                    <p className="mb-3">Please set the delivery address for this order to calculate delivery charges.</p>
                    <button 
                        onClick={() => {
                            setShowAddressForm(true);
                            // Clear form fields for new address
                            setNewAddress('');
                            setSelectedDistrict('');
                        }}
                        className="btn btn-primary"
                    >
                        Add Delivery Address
                    </button>
                </div>
            ) : showAddressForm ? (
                <div className="border rounded-3 p-4 bg-light w-100" style={{borderRadius: '12px'}}>
                    <h5 className="mb-3 text-dark fw-medium">📍 Set Delivery Address</h5>
                    <div className="alert alert-info mb-3 rounded-3">
                        <small>
                            <strong>Note:</strong> This delivery address will be used only for this order and won't update your profile address.
                        </small>
                    </div>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium">District *</Form.Label>
                            <Form.Select 
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                required
                                style={{width: '100%'}}
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
                                <option value="Anuradhapura">Anuradhapura</option>
                                <option value="Polonnaruwa">Polonnaruwa</option>
                                <option value="Badulla">Badulla</option>
                                <option value="Moneragala">Moneragala</option>
                                <option value="Ratnapura">Ratnapura</option>
                                <option value="Kegalle">Kegalle</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-medium">Full Address *</Form.Label>
                            <small className="text-muted d-block mb-2">
                                Please enter your complete street address and city (without district)
                            </small>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Example: No. 123, Galle Road, Colombo 03 or Temple Road, Udaiyarkaddu" 
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                required
                                style={{width: '100%', resize: 'vertical'}}
                            />
                            <small className="text-muted">
                                Include: House/Building number, Street name, City/Area
                            </small>
                        </Form.Group>
                        <div className="d-flex gap-2 mt-3">
                            <Button variant="secondary" onClick={handleCancelForm} className="flex-fill">
                                Cancel
                            </Button>
                            <Button variant="success" onClick={handleAddressUpdate} className="flex-fill">
                                Set Delivery Address
                            </Button>
                        </div>
                    </Form>
                </div>
            ) : (
                <div>
                    {/* Address Display */}
                    <div className="bg-light p-4 rounded-3 border w-100 mb-3" style={{borderRadius: '12px'}}>
                        <p className="small text-muted fw-medium mb-2">📍 Delivery Address:</p>
                        <p className="text-dark fw-medium mb-3">{userAddress}</p>
                        <button 
                            type="button"
                            className="btn btn-outline-primary btn-sm rounded-3"
                            onClick={handleChangeAddress}
                        >
                            Change Delivery Address
                        </button>
                    </div>

                    {/* Delivery Calculation */}
                    <div className="bg-primary bg-opacity-10 p-4 rounded-3 border border-primary border-opacity-25 shadow-sm w-100" style={{borderRadius: '12px'}}>
                        <h4 className="fw-bold text-dark mb-3">💰 Delivery Calculation</h4>
                        
                        <div className="mb-2">
                            <div className="d-flex justify-content-between small">
                                <span className="text-muted">Cart Total:</span>
                                <span className="fw-medium">{formatCurrency(Number(cartTotal) || 0)}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between small">
                                <span className="text-muted">Delivery Charge:</span>
                                <span className="fw-medium text-primary">{formatCurrency(Number(deliveryCharge) || 0)}</span>
                            </div>
                        </div>

                        <div className="border-top pt-2 mt-2">
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total with Delivery:</span>
                                <span className="text-success">{formatCurrency((Number(cartTotal) || 0) + (Number(deliveryCharge) || 0))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryCalculator;
