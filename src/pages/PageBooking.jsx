import React, {useEffect, useState} from 'react';
import Footer from '../components/Footer/Footer';
import NavBooking from '../components/Booking/NavBooking';
import Booking from '../components/Booking/Booking';
import {useParams} from "react-router-dom";

function PageBooking() {

    const { id } = useParams()

    return (
        <div>
            <NavBooking/>
            <Booking id={id}/>
            <Footer/>
        </div>
    );
}

export default PageBooking;
