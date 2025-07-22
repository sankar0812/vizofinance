import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const ConfirmDialog = ({ open, message, mode = 'ok', onClose }) => {
  const handleYes = () => onClose(null, true);
  const handleNo = () => onClose(null, false);
  const handleOk = () => onClose(null, true);

  const yesNo = mode === 'yesno';
  return (
    <Dialog open={open} onClose={yesNo ? handleNo : handleOk} maxWidth="xs" fullWidth>
      <DialogTitle>{yesNo ? 'Please Confirm' : 'Notice'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {yesNo ? (
          <>
            <Button onClick={handleNo} color="inherit">No</Button>
            <Button onClick={handleYes} color="error" variant="contained">Yes</Button>
          </>
        ) : (
          <Button onClick={handleOk} autoFocus variant="contained">OK</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;