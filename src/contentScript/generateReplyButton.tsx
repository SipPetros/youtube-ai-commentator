import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ContentButtonProps {
  onClick: () => void;
}

const ContentButton: React.FC<ContentButtonProps> = ({ onClick, }) => {
  const [disableBtn, setDisableBtn] = useState(false);
  const handleClick = () => {
    setDisableBtn(true);
    onClick();
  }
  return (
      <Button disabled={disableBtn} variant='outlined' sx={{ borderRadius: 18, height: 36, fontSize: 10 }} onClick={handleClick}>Generate reply</Button>
  );
};

export default ContentButton;