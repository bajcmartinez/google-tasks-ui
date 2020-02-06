import React, { ChangeEvent, useEffect, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { debounce } from 'throttle-debounce';
import ListItem from '@material-ui/core/ListItem';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Task } from '../../../../types/google';

interface IProps {
  task: Task;
  updateTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
}

const SubtaskEdit: React.FC<IProps> = ({ task, updateTask, deleteTask }) => {
  const [form, setForm] = React.useState<Task>(task);

  const debounced = useRef(
    debounce(500, (updatedTask: Task | null) => {
      if (updatedTask && updatedTask.isDirty) {
        updateTask({
          ...updatedTask,
          isDirty: false,
        });
      }
    }),
  );

  // Reset the form when the task props changes
  useEffect(() => {
    setForm(task);
  }, [task]);

  // Save when the task changes
  useEffect(() => {
    debounced.current(form);
  }, [form]);

  const handleChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [name]: event.target.value,
      isDirty: true,
    });
  };

  return (
    <>
      <ListItem>
        <TextField placeholder="Title" value={form.title} onChange={handleChange('title')} fullWidth />

        <IconButton color="default" aria-label="Delete" onClick={() => deleteTask(form)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    </>
  );
};

export default SubtaskEdit;
