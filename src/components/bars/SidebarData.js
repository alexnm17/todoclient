import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as FcIcons from 'react-icons/fc';

export const SidebarData = [
  {
    title: 'Friends',
    path: '#',
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  {
    title: 'Friend Requests',
    path: '#',
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text'
  },
  {
    title: 'Sharing Notifications',
    path: '#',
    icon: <FaIcons.FaShareAltSquare />,
    cName: 'nav-text'
  }
];