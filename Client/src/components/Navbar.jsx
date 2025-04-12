import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import { getCSSVariables } from "../styles/GetCssVariables";


const Navbar = () => {

  const variables = getCSSVariables();
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const user = useSelector((state) => state.user);
  
  const dispatch = useDispatch();


  const [search, setSearch] = useState("")

  const navigate = useNavigate()

  return (
    <div className="navbar">
      <a href="/" >
        <img src="/assets/logo.png" alt="logo" />
      </a>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search
            sx={{ color: variables.pinkred }}
            onClick={() => {navigate(`/properties/search/${search}`)}}
          />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user ? (
          <Link to="/create-listing" className="host">
            Become A Host
          </Link>
        ) : (
          <Link to="/login" className="host">
            Become A Host
          </Link>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user || user.roleId.name!=="Host" ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={`${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && user.roleId.name==="Host" &&(
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/trips`}>Trip List</Link>
            {/* <Link to={`/${user._id}/wishList/`}>Wish List</Link> */}
            <Link to={`/${user._id}/properties`}>Property List</Link>
            <Link to={`/${user._id}/reservations/`}>Reservation List</Link>
            <Link to="/create-listing">Become A Host</Link>

            <Link
              to="/"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}

        {dropdownMenu && user && user.roleId.name==="Admin" &&(
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/gethosts/`}>Hosts</Link>
            <Link to={`/${user._id}/wishList/`}>Properties List</Link>
            <Link to={`/${user._id}/requestpage/`}>Request List</Link>

            <Link
              to="/"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}

        {dropdownMenu && user && user.roleId.name==="Guest" &&(
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/trips`}>Trip List</Link>
            <Link to={`/${user._id}/reservations/`}>Reservation List</Link>

            <Link
              to="/"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
