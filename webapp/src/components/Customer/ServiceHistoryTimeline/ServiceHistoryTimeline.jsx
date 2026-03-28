import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceHistoryTimeline = ({ loading, history, id }) => {
    const navigate = useNavigate();

    return (
        <div className="details-card history-card">
            <div className="card-header">
                <h3 className="card-title">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    Service History
                </h3>
                <button className="download-pdf-btn">
                    Download PDF Log <i className="fa-solid fa-download"></i>
                </button>
            </div>

            <div className="timeline-container">
                {loading ? (
                    <div className="loading-state-container">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <p>Fetching history logs...</p>
                    </div>
                ) : history.length > 0 ? (
                    <div className="timeline-list">
                        {history.slice(0, 5).map((item, index) => (
                            <div className="timeline-item" key={item.id || index}>
                                <div className="timeline-marker">
                                    <i className="fa-solid fa-circle-check"></i>
                                </div>
                                <div className="service-entry-card">
                                    <div className="entry-main-info">
                                        <div className="entry-text">
                                            <h4 className="entry-name">{item.service || 'Interim Service'}</h4>
                                            <p className="entry-desc">
                                                {item.description || 'Full system diagnostics, fluid top-ups and safety inspection.'}
                                            </p>
                                        </div>
                                        <div className="entry-price-tag">
                                            LKR {item.price || "Unknown"}
                                        </div>
                                    </div>

                                    <div className="entry-meta-row">
                                        <div className="meta-left">
                                            <span className="meta-data">
                                                <i className="fa-regular fa-calendar"></i>
                                                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <span className={`service-status-badge ${item.status?.toLowerCase() || 'completed'}`}>
                                            {item.status || 'COMPLETED'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-container">
                        <div className="empty-state-icon">
                            <i className="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <p className="empty-state-text">No service history yet.</p>
                    </div>
                )}
            </div>

            <div className="history-footer">
                <button
                    className="load-more-btn"
                    onClick={() => navigate('/customer/service-history', { state: { vehicleId: id } })}
                >
                    View More
                </button>
            </div>
        </div>
    );
};

export default ServiceHistoryTimeline;
