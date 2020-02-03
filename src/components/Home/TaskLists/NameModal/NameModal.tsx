import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

interface IProps {
  open: boolean
  handleClose(): void
  handleSaveTaskList(name: string): void
}

export const NameModal: React.FC<IProps> = (props) => {
  const { open, handleClose, handleSaveTaskList } = props;

  const [name, setName] = useState('');

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Task List</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name for the task list.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Task List Name"
          type="text"
          fullWidth
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleSaveTaskList(name)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}