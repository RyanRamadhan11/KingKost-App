import React from 'react';

function TermsAndConditions() {
  return (
    <div className="container py-5">
      <div className="p-5">
        <h2 className="text-center">Terms and Conditions</h2>
        <p className="pt-5">
          Hello, thank you for visiting the Kingkos website or Kingkos application, which is a web platform for booking boarding houses.
        </p>
        <p>
          This platform is owned and operated by Kingkos and its affiliates. We advise users, namely customers (boarding house residents) and sellers (boarding house lessors), to read these Terms and Conditions periodically, including the Privacy Policy and User Penalty Policy, which are an integral part of these Terms and Conditions as they may affect your rights and obligations.
        </p>
        <p>
          By visiting, using, accessing, and/or registering yourself on Our Platform, you are deemed to have read, understood, comprehended, and agreed to all the contents contained in these Terms and Conditions. If you do not agree to be bound by these Terms and Conditions, you are not allowed to access and/or use Our Platform.
        </p>
      </div>

      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              Definitions
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className="accordion-collapse collapse show"
          >
            <div className="accordion-body">
              <p>
                1.1 "Request Lease" means that the Tenant can make a reservation and/or request a lease on the property for the available and selected dates by the Tenant.
              </p>
              <p>
                1.2 "Kingkos User Account" means the registered account owned by you and managed by Kingkos.
              </p>
              <p>
                1.3 "Tenant" means a prospective or resident of the Property who uses the Request Lease feature.
              </p>
              <p>
                1.4 "Owner" means the legal owner or authorized party of the Property that can be proven under the laws of the Republic of Indonesia intending to lease the Units contained in the Property.
              </p>
              <p>
                1.5 "Property" means a boarding house, house for rent, or one apartment unit managed by the Owner listed on Our Platform.
              </p>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              Reservation (Booking), Check-in, Room Relocation, and Rescheduling
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            className="accordion-collapse collapse"
          >
            <div className="accordion-body">
              <p>
                2.1 Tenants select a Property listed in the Listing according to their needs.
              </p>
              <p>
                2.2 Complete Tenant's personal data according to the form provided on the Platform.
              </p>
              <p>
                2.3 Tenants can make a reservation for the selected Property by submitting a lease request and making payment according to the provisions in Clause 7 of these Terms and Conditions.
              </p>
              <p>
                2.4 Tenants are obliged to check in using the "check-in" feature through Our Platform according to the dates listed on the Contract. If within 5x24 hours since the Tenant's Start Date the Tenant does not change this status, We cannot assist in the refund process. This provision does not apply to Properties with the "Singgahsini, APIK, and/or Kos Pilihan" logo/flagging on the Platform.
              </p>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              Can I cancel my boarding house reservation after making payment?
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className="accordion-collapse collapse"
          >
            <div className="accordion-body">
              <h5 className="mb-3">General Terms</h5>

              <p>
                3.1.1 You are required to transact on this Platform through the procedures that We have set and make payments using the payment methods that you have previously selected and available on this Platform.
              </p>

              <p>
                3.1.2 Any payment made through the Platform must use the Indonesian Rupiah currency.
              </p>

              <p>
                3.1.3 Any invoice document that We provide is based on the transactions you make and issued in your name both as a Tenant and as an Owner.
              </p>

              <p>
                3.1.4 You are required to recheck every payment you have made with the details of the reservation you have made.
              </p>

              <p>
                3.1.5 Every payment made, We will not collect taxes or levies on the payment and therefore any taxes or levies that may arise become your obligation.
              </p>

              <h5 className="mb-3 mt-4">Payment Terms by Tenant</h5>

              <p>
                3.2.1 You are required to make payments using the following methods including but not limited to bank transfer to the account listed on the Platform, transfer via virtual account, credit card, payment gateway, or pay later provided on Our Platform.
              </p>

              <p>
                3.2.2 You are required to understand that each payment method will have different steps, you agree to complete each step for the available payment methods including providing Us with proof of payment that you have made.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
