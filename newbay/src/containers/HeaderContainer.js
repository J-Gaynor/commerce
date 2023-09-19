import HeaderComponent from "../components/HeaderComponent";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { logoutUser } from "../slices/loginSlice";


function HeaderContainer() {
    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logoutUser());
        localStorage.setItem('authToken', null);
        fetch('http://localhost:8000/logout/', {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => {
            if (response.ok) {
                document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = '/';
            } else {
                console.log('response not ok')
            }
        })
        .catch((error) => {
            console.log(error)
        });
    };
    const isAuthenticated = useSelector((state) => state.login.user !== null);
    // console.log(localStorage.getItem('authToken'));
    // console.log(useSelector((state) => state.login.user))

    return (
        <HeaderComponent 
            handleLogout={handleLogout}
            isAuthenticated={isAuthenticated}
        />
    )
}

export default HeaderContainer;