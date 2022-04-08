import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';


export default function Header(){

  const navigate = useNavigate(); 


    return (
      <Navbar color="blue" expand="md">
        <NavbarBrand><span className="text-white"><strong> TO DO LIST</strong></span></NavbarBrand>
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link to="/Tasks" style={{ textDecoration: 'none' }}><NavLink><span className="text-white" border="0">Tasks </span></NavLink></Link>
            </NavItem>
            <NavItem>
            <Link to="/Projects" style={{ textDecoration: 'none' }}><NavLink><span className="text-white">Projects</span></NavLink></Link>
            </NavItem>
          </Nav>
          <NavbarText>
            <span className="text-white">{sessionStorage.getItem('userName')} </span>
            <Link to="/" style={{ textDecoration: 'none' }}><NavLink><span className="text-white" border="0">Log Out</span></NavLink></Link>
          </NavbarText>
        </Collapse>
      </Navbar>
    );
  }
