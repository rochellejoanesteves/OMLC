import React, { useState } from 'react';

interface FolderProps {
  name: string;
  children?: React.ReactNode;
}

const Folder: React.FC<FolderProps> = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={toggleFolder}>
        {isOpen ? '📂 ' : '📁 '}
        {name}
      </div>
      {isOpen && <div style={{ marginLeft: '20px' }}>{children}</div>}
    </div>
  );
};

export default Folder;
