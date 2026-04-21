import React from "react";
import getImageUrl from "../../util/getImageUrl";
import "./HomeServices.css";

const HomeServices = ({ services = [], packages = [] }) => {
  const getMinPrice = (item, type) => {
    if (type === "package") {
      if (!item.pricingTiers || item.pricingTiers.length === 0) return 0;
      return Math.min(...item.pricingTiers.map((t) => t.price));
    } else {
      if (!item.prices || item.prices.length === 0) return 0;
      return Math.min(...item.prices.map((p) => p.price));
    }
  };
  return (
    <section className="home-services m-section-padding">
      {/* Packages Section */}
      {packages.length > 0 && (
        <div
          className="packages-container mb-huge"
          style={{ marginBottom: "8rem" }}
        >
          <div className="m-container m-centered">
            <span className="m-section-tag">PREMIUM CARE</span>
            <h2 className="m-section-title">Exclusive Service Packages</h2>
          </div>
          <div className="m-container">
            <div className="services-grid">
               {packages.map((pkg) => (
                 <div key={pkg._id} className="service-card package-card shadow-sm">
                   <div className="service-img">
                     <img
                       src={getImageUrl(pkg?.image?.filePath)}
                       alt={pkg.name}
                     />
                   </div>
                   <div className="service-info">
                     <div className="info-top">
                        <h3>{pkg.name}</h3>
                        <div className="service-price">
                          Starting from <span>Rs. {getMinPrice(pkg, "package")}</span>
                        </div>
                     </div>
                     <p
                       className="m-body-text"
                       style={{ fontSize: "0.95rem", marginBottom: "2rem" }}
                     >
                       {pkg.description ||
                         `Comprehensive care tailored for your ${pkg.applicableVehicalModels.join(", ")}.`}
                     </p>
                     
                     {pkg.servicesIncluded && pkg.servicesIncluded.length > 0 && (
                       <div className="included-services">
                         <span className="list-title">INCLUSIONS</span>
                         <ul className="service-list">
                           {pkg.servicesIncluded.map((s, idx) => (
                             <li key={s._id || idx}>
                               <i className="fa-solid fa-circle-check"></i>
                               {s.name}
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Individual Services Section */}
      {services.length > 0 && (
        <div className="services-container">
          <div className="m-container m-centered">
            <span className="m-section-tag">ELITE MAINTENANCE</span>
            <h2 className="m-section-title">Individual Services</h2>
          </div>
          <div className="m-container">
            <div className="services-grid">
              {services.map((service) => (
                <div key={service._id} className="service-card shadow-sm">
                  {service?.image?.filePath ? (
                    <div className="service-img">
                      <img
                        src={getImageUrl(service?.image?.filePath)}
                        alt={service.name}
                      />
                    </div>
                  ) : null}
                   <div className="service-info">
                     <div className="info-top">
                        <h3>{service.name}</h3>
                        <div className="service-price">
                          Starting from <span>Rs. {getMinPrice(service, "service")}</span>
                        </div>
                     </div>
                     <p
                       className="m-body-text"
                       style={{ fontSize: "0.95rem", marginBottom: "2rem" }}
                     >
                       {service.description ||
                         "Professional automotive service delivered with precision and care."}
                     </p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeServices;
