import React from 'react';

import Footer from "../components/Footer/Footer.jsx";
import NavTransactionList from '../components/Transaction/NavTransactionList.jsx';
import TransactionHistory from '../components/Transaction/TransactionHistory.jsx';

function PageTransactionCust() {
    return (
        <div>
            <NavTransactionList/>
            <TransactionHistory/>
            <Footer/>
        </div>
    );
}

export default PageTransactionCust;