import React, { useEffect } from "react";
import ItemListingComponent from "../components/ItemListingComponent";
import HeaderContainer from "./HeaderContainer";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchListingRequest, fetchListingSuccess, fetchListingFailure } from '../slices/itemListingSlice';

function ItemListingContainer() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.item)
    const idParam = useParams();
    const id = idParam.id;

    useEffect(() => {
        dispatch(fetchListingRequest());
        fetch(`http://localhost:8000/listing/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error ('Network response failure')
                }
                return response.json();
            })
            .then((data) => {
                dispatch(fetchListingSuccess(data));
            })
            .catch((error) => {
                dispatch(fetchListingFailure(error.message))
            })
    }, [])

    const {item_name, description, image, category_name, price} = useSelector((state) => state.item.data.listing[0])

    if (loading) {
        return <p>Loading...</p>;
    }
    
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <HeaderContainer />
            <ItemListingComponent 
                item_name={item_name}
                description={description}
                image={image}
                category_name={category_name}
                price={price}
            />
        </>
    )
}

export default ItemListingContainer;