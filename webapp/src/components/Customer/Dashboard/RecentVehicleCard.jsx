import React from 'react';
import { Link } from 'react-router-dom';
import getImageUrl from '../../../util/getImageUrl';
import defaultCarImg from '../../../assets/imgs/default-car.png';

const RecentVehicleCard = ({ vehicle }) => {
    return (
        <Link to={`/customer/my-garage/${vehicle._id}`} className="vehicle-item-card" key={vehicle._id} style={{ textDecoration: 'none' }}>
            <div className="vehicle-image">
                <img src={getImageUrl(vehicle.image?.filePath) || defaultCarImg} alt={vehicle.model} />
            </div>
            <div className="vehicle-details">
                <h5 className="vehicle-name">{vehicle.make} {vehicle.model}</h5>
                <span className="vehicle-year">{vehicle.year || 'N/A'} • {vehicle.licensePlate}</span>
            </div>
            <div className="service-status">
                <span className="dot"></span>
                <span>{vehicle.type}</span>
            </div>
        </Link>
    );
};

export default RecentVehicleCard;
