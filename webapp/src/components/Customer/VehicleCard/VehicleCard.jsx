import React from 'react';
import { Link } from 'react-router-dom';
import getImageUrl from '../../../util/getImageUrl';
import defaultCarImg from '../../../assets/imgs/default-car.png';
import './VehicleCard.css';

const VehicleCard = ({ vehicle, onDelete, isNewCard }) => {
    // If it's a placeholder "Add New" card
    if (isNewCard) {
        return (
            <Link to="/customer/my-garage/add" className="vehicle-card add-placeholder-card">
                <div className="placeholder-content">
                    <div className="plus-circle">
                        <i className="fa-solid fa-plus"></i>
                    </div>
                    <h4 className="placeholder-title">Add Another Vehicle</h4>
                    <p className="placeholder-text">Track and manage more cars in your profile</p>
                </div>
            </Link>
        );
    }

    // Determine the active status for the badge
    // const statusText = vehicle.status?.toUpperCase() || 'ACTIVE';
    // const statusClass = vehicle.status === 'in-service' ? 'in-service' : 'active';

    return (
        <div className="vehicle-card">
            <div className="card-image-wrapper">
                <img
                    src={getImageUrl(vehicle.image?.filePath) || defaultCarImg}
                    alt={vehicle.model}
                    className="vehicle-card-img"
                />
                <span className="type-badge">
                    {vehicle.type}
                </span>
            </div>
            <div className="card-content">
                <div className="vehicle-basic-info">
                    <h4 className="vehicle-title">{vehicle.make} {vehicle.model}</h4>
                    <span className="year-label">{vehicle.year || 'N/A'}</span>
                </div>
                <div className="vehicle-meta">
                    <div className="meta-item plate">
                        <span>{vehicle.licensePlate}</span>
                    </div>
                    <div className="meta-item time">
                        <i className="fa-regular fa-calendar-check"></i>
                        <span>{new Date(vehicle.createdAt).toLocaleDateString()} added</span>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <Link to={`/customer/my-garage/${vehicle._id}`} className="view-details-link">
                    <span>VIEW DETAILS</span>
                    <i className="fa-solid fa-arrow-right"></i>
                </Link>
                {onDelete && (
                    <div className="action-icons">
                        <button
                            className="icon-btn delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(vehicle._id);
                            }}
                            title="Remove Vehicle"
                        >
                            <i className="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleCard;
