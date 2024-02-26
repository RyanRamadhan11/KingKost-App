import React, { useState, useEffect } from 'react';
import axios from '../../store/axiosInterceptor';
import { useSelector } from 'react-redux';
import { Card, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

function AddTestimonial() {
    const userId = useSelector((state) => state.authentication.userId);
    const navigate = useNavigate(); 

    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;


    const [formData, setFormData] = useState({
        message: '',
        customerId: '',
    });

    const [errors, setErrors] = useState({
        message: '',
    });

    // Function to handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Function to fetch customer data from API and set customerId
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`/customer/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const customerData = response.data.data;
                setFormData({
                    ...formData,
                    customerId: customerData.id
                });
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        if (userId) {
            fetchCustomerData();
        }
    }, [userId]); // Trigger useEffect when userId changes

    // Function to validate form fields
    const validateForm = () => {
        const validationErrors = {
            message: formData.message.trim() === "" ? "Message is required" : "",
        };

        // Set errors state with validationErrors object
        setErrors(validationErrors);

        // Check if all fields are valid
        const isFormValid = Object.values(validationErrors).every(error => error === "");

        return isFormValid;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                await axios.post('/review/v1', {
                    message: formData.message,
                    customerId: formData.customerId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setFormData({
                    message: '',
                    customerId: '',
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Testimonial berhasil ditambahkan!',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    navigate('/testimonial'); // Redirect to testimonial page using navigate
                });
            } catch (error) {
                console.error('Error adding testimonial:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Gagal menambahkan testimonial. Mohon coba lagi.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Harap isi semua kolom dengan benar.',
            });
        }
    };

    return (
        <div className="container mt-5">
            <div className='w-20 mb-5'>
                <Link to="/profile" className="btn btn-outline-secondary" style={{ borderRadius: '10px' }}>
                    <i className="fas fa-arrow-left"> Back </i>
                </Link>
            </div>
            <h2 className="mb-4">Berikan Testimonial</h2>
            <Card className="shadow">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formMessage">
                            <Form.Label>Pesan Testimonial Mengenai Aplikasi Kingkos</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Masukkan testimonial Anda di sini"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                            />
                            {errors.message && <Form.Text className="text-danger">{errors.message}</Form.Text>}
                        </Form.Group>
                        <Button className='mt-4' style={{borderRadius: '15px'}} variant="secondary" type="submit">
                            Kirim Testimonial
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default AddTestimonial;
