import React from "react";

function ItemListingComponent({id, item_name, description, image, seller_id, category_name, price}) {
    return(
        <div id='item-listing-page'>
            <img src={image} alt={`An image of ${item_name}`} id='item-image'/>
            <h2 id='item-name'>{item_name}</h2>
            <h3 id='item-description'>{description}</h3>
            <p id='item-seller'>{seller_id}</p>
            <p id='item-category'>{category_name}</p>
            <h4 id='item-price'>£{price}</h4>
        </div>
    )
}

export default ItemListingComponent;