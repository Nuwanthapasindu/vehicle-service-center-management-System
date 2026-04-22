import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HomeHero from '../../components/Home/HomeHero';
import HomeStats from '../../components/Home/HomeStats';
import HomeServices from '../../components/Home/HomeServices';
import HomeTestimonials from '../../components/Home/HomeTestimonials';
import HomeCTA from '../../components/Home/HomeCTA';
import serviceService from '../../services/serviceService';
import packageService from '../../services/packageService';
import './HomePage.css';

function HomePage() {
    const [services, setServices] = useState([]);
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const servicesRes = await serviceService.getPublicServices();
                const packagesRes = await packageService.getPublicPackages();
                
                setServices(servicesRes.data.payload.services);
                setPackages(packagesRes.data.payload.packages);
            } catch (error) {
                console.error("Error fetching home page data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="home-page-wrapper">
            <Header />
            <main>
                <HomeHero />
                <HomeStats />
                <HomeServices services={services} packages={packages} />
                <HomeTestimonials />
                <HomeCTA />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;