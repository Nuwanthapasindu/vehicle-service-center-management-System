import React from 'react';
import './HomeStats.css';

const HomeStats = ({ packages = [] }) => {
    // Extract unique applicable vehicle models from packages
    const modelsList = packages.reduce((acc, pkg) => {
        if (pkg.applicableVehicalModels) {
            pkg.applicableVehicalModels.forEach(model => {
                if (model && model.trim() !== '' && !acc.includes(model.trim())) {
                    acc.push(model.trim());
                }
            });
        }
        return acc;
    }, []);

    // Fallback brands list if packages are still loading or have no models
    const fallbackBrands = [
        "BMW",
        "Mercedes-Benz",
        "Audi",
        "Lexus",
        "Porsche",
        "Tesla",
        "Land Rover",
        "Toyota",
        "Honda",
        "Nissan",
        "Volvo"
    ];

    const displayBrands = modelsList.length > 0 ? modelsList : fallbackBrands;

    // Duplicate the list of brands to make a seamless continuous looping scroll
    const loopedBrands = [...displayBrands, ...displayBrands];

    return (
        <section className="home-stats-ribbon">
            <div className="ribbon-title">
                <span>WE SERVICE ALL MAJOR VEHICLE TYPES</span>
            </div>
            <div className="slider">
                <div className="slide-track">
                    {loopedBrands.map((brand, index) => (
                        <div className="slide" key={index}>
                            <span className="brand-name">{brand}</span>
                            <span className="brand-dot">•</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeStats;
