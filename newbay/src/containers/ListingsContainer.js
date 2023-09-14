import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListingsRequest, fetchListingsSuccess, fetchListingsFailure } from '../slices/listingsSlice';
import ListingsComponent from '../components/ListingsComponent';

function ListingsContainer() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.listings);

    useEffect(() => {
        dispatch(fetchListingsRequest());
        fetch('http://localhost:8000/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error ('Network response failure')
                }
                return response.json();
            })
            .then((data) => {
                dispatch(fetchListingsSuccess(data));
            })
            .catch((error) => {
                dispatch(fetchListingsFailure(error.message))
            })
    }, [])

    if (loading) {
        return <p>Loading...</p>;
    }
    
    if (error) {
        return <p>Error: {error}</p>;
    }
    
    return <ListingsComponent />;
}

export default ListingsContainer;