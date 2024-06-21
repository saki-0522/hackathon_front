import React from 'react';
import { Link } from 'react-router-dom';

interface MenuBarProps {
  onSignOut: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onSignOut }) => {
  return (
    <div className="menu-bar">
      <Link to="/">ホーム</Link>
      <button onClick={onSignOut}>ログアウト</button>
    </div>
  );
};

export default MenuBar;
