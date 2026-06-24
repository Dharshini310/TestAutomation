import React, { useContext, useState } from 'react';
import './Sidebar.css';
import Create from '../create/Create';
import { lex_context } from '../../App';

function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [showBots, setShowBots] = useState(false);

  const handleLexTestSet = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className='content'>
      <div
  className={`sidebar ${collapsed ? 'collapsed' : ''}`}
>
  <div
    className='sidebar-title'
    onClick={handleLexTestSet}
  >
    ☰ {collapsed ? '' : 'Lex Test Set'}
  </div>

  <div
    className={`sidebar-item ${
      activeMenu === "myBots"
        ? "active"
        : ""
    }`}
    onClick={() => {
  setActiveMenu("myBots");
  setShowBots(!showBots);
}}
  >
    📁 My Bots
  </div>

</div>

      <div className='main-content'>
         <Create activeMenu={activeMenu} showBots={showBots}/>
      </div>
    </div>
  );
}

export default Sidebar;