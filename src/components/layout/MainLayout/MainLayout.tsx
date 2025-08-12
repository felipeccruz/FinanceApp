import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { BottomNavigation, TransactionForm } from '../..';

const MainLayout: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  const handleOpenModal = (): void => {
    setShowModal(true);
  };

  return (
    <>
      <div className="main-container">
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="p-4">
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation />

        <button
          className="floating-btn"
          onClick={handleOpenModal}
          aria-label="Nova Transação"
        >
          <i className="fas fa-plus me-2"></i>
          Nova Transação
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div 
            className="modal fade show d-block" 
            tabIndex={-1}
            onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-plus-circle me-2"></i>
                    Nova Transação
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  />
                </div>
                <div className="modal-body">
                  <TransactionForm onClose={handleCloseModal} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainLayout; 