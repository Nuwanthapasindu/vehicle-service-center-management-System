import React from 'react';
import defaultOgImage from '../../assets/imgs/about/about_hero.png';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    path = '', 
    image,
    schema,
    services = []
}) => {
    const siteName = 'Shine Depot';
    const baseUrl = 'https://shinedepot.lk'; // Replace with actual production URL if known
    const canonicalUrl = `${baseUrl}${path}`;
    
    // Resolve absolute image URL at runtime
    const origin = typeof window !== 'undefined' ? window.location.origin : baseUrl;
    const finalImage = image
        ? (image.startsWith('http') ? image : new URL(image, origin).toString())
        : new URL(defaultOgImage, origin).toString();
    
    // Default meta values
    const defaultTitle = 'Shine Depot | Premium Car Wash, Detailing & Servicing in Nugegoda';
    const displayTitle = title ? `${title} | ${siteName}` : defaultTitle;
    
    const defaultDescription = 'Shine Depot is Nugegoda’s premier vehicle service center specializing in professional car washing, deep interior/exterior detailing, paint correction, ceramic coating, and full mechanical vehicle servicing.';
    const displayDescription = description || defaultDescription;

    const defaultKeywords = 'Shine Depot, car wash near me, car detailing Nugegoda, vehicle service center Colombo, auto servicing, ceramic coating Sri Lanka, car polishing, engine tune-up, interior cleaning, hybrid service, auto repair';
    const displayKeywords = Array.isArray(keywords) ? keywords.join(', ') : (keywords || defaultKeywords);

    // Default Local Business Schema
    const defaultSchema = {
        '@context': 'https://schema.org',
        '@type': 'AutoRepair',
        'name': 'Shine Depot',
        'alternateName': 'Shine Depot Car Detailing & Service Center',
        'description': defaultDescription,
        'image': finalImage,
        '@id': `${baseUrl}/#organization`,
        'url': baseUrl,
        'telephone': '+94 76 315 3797',
        'priceRange': '$$',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': '108 Old Kottawa Rd',
            'addressLocality': 'Nugegoda',
            'addressRegion': 'Western Province',
            'postalCode': '10250',
            'addressCountry': 'LK'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 6.8724169,
            'longitude': 79.9049978
        },
        'openingHoursSpecification': [
            {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                'opens': '08:00',
                'closes': '19:00'
            },
            {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': 'Sunday',
                'opens': '09:00',
                'closes': '17:00'
            }
        ],
        'sameAs': [
            'https://www.facebook.com/shinedepot.lk',
            'https://www.instagram.com/shinedepot.lk'
        ]
    };

    // Dynamically insert service offerings catalog if services are provided
    if (services && services.length > 0) {
        defaultSchema.hasOfferCatalog = {
            '@type': 'OfferCatalog',
            'name': 'Shine Depot Services',
            'itemListElement': services.map(service => ({
                '@type': 'Offer',
                'itemOffered': {
                    '@type': 'Service',
                    'name': service.name,
                    'description': service.description || 'Professional automotive service delivered with precision and care.'
                }
            }))
        };
    }

    const activeSchema = schema || defaultSchema;

    return (
        <>
            {/* Standard HTML Metadata (Hoisted by React 19) */}
            <title>{displayTitle}</title>
            <meta name="description" content={displayDescription} />
            <meta name="keywords" content={displayKeywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph (Facebook / LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={displayTitle} />
            <meta property="og:description" content={displayDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={displayTitle} />
            <meta name="twitter:description" content={displayDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* Structured Schema Markup (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(activeSchema)}
            </script>
        </>
    );
};

export default SEO;
