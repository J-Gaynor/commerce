import React from 'react';
import { useSelector } from 'react-redux';

function ListingsComponent() {
    const listings = useSelector((state) => state.listings.data)
    console.log(listings)
    return (
        <div>
            <h2>Listings</h2>
            <ul className='listing-items'>
                {listings.map((listing) => (
                    <li key={listing.id}>
                        <img src={listing.image} alt={listing.item_name} className='listing-image'/>
                        <h3>{listing.item_name}</h3>
                        <p>Price: {listing.price}</p>
                    </li>
                ))}
            </ul>
      </div>
    );
};

export default ListingsComponent;