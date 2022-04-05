import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';


export default function Header(){
  
    return sessionStorage.getItem('userRole')==="User"?(
      <Navbar color="white" expand="md">
        <NavbarBrand><span className="text-black"><strong> TO DO LIST</strong></span></NavbarBrand>
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link to="/Tasks" style={{ textDecoration: 'none' }}><NavLink><span className="text-black" border="0">Tasks </span></NavLink></Link>
            </NavItem>
            <NavItem>
            <Link to="/Projects" style={{ textDecoration: 'none' }}><NavLink><span className="text-black">Projects</span></NavLink></Link>
            </NavItem>
          </Nav>
          <NavbarText>
            <span className="text-black">{sessionStorage.getItem('userName') + " ("+sessionStorage.getItem('userRole')+")"} </span>
            <Link to="/" style={{ textDecoration: 'none' }}><NavLink><span className="text-black" border="0">Log Out</span></NavLink></Link>
          </NavbarText>
        </Collapse>
      </Navbar>
    ):(
      <Navbar color="black" expand="md">
        <NavbarBrand><span className="text-white"><strong> TO DO LIST</strong></span></NavbarBrand>
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link to="/AdminTasks" style={{ textDecoration: 'none' }}><NavLink><span className="text-white" border="0">Tasks </span></NavLink></Link>
            </NavItem>
            <NavItem>
              <Link to="/AdminProjects" style={{ textDecoration: 'none' }}><NavLink><span className="text-white">Projects</span></NavLink></Link>
            </NavItem>
            <NavItem>
            <Link to="/Users" style={{ textDecoration: 'none' }}><NavLink><span className="text-white">Users</span></NavLink></Link>
            </NavItem>
          </Nav>
          <NavbarText>
            <span className="text-white">{sessionStorage.getItem('userName') + " ("+sessionStorage.getItem('userRole')+")"} </span>
            <Link to="/" style={{ textDecoration: 'none' }}><NavLink><span className="text-white" border="0">Log Out</span></NavLink></Link>
          </NavbarText>
        </Collapse>
      </Navbar>
    )
  }
