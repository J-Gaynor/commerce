import React from 'react';
import { useSelector } from 'react-redux';

function ListingsComponent() {
    const listings = useSelector((state) => state.listings.data)

    return (
        <div>
            <h2>Listings</h2>
            <ul className='listing-items'>
                {listings.map((listing) => (
                    <a key={listing.id} href={`listing/${listing.id}`} className='listing-link'>
                        <li className='listing-box'>
                            <img 
                                src={listing.image}
                                alt={listing.item_name}
                                className='listing-image'
                            />
                            <h3>{listing.item_name}</h3>
                            <p>Price: £{listing.price}</p>
                        </li>
                    </a>
                ))}
            </ul>
      </div>
    );
};

export default ListingsComponent;