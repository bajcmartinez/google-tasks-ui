import React, { useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TaskList } from '../../../services/GoogleTasks';
import Divider from '@material-ui/core/Divider';
import List  from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon  from '@material-ui/icons/List';

interface IProps {
  taskLists: TaskList[],
  selectedTaskListChanged: (id: string) => void
}

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
}));

const Menu: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { taskLists, selectedTaskListChanged } = props;

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const selectTaskList = (index: number) => {
    setSelectedIndex(index);
    if (index >= 0)
      selectedTaskListChanged(taskLists[index].id);
    else
      selectedTaskListChanged("all");
  }

  return (
    <div>
      <div className={classes.toolbar} />

      <Divider />

      <List component="nav" aria-label="Main Actions">
        <ListItem
          button
          selected={selectedIndex === -1}
          onClick={() => selectTaskList(-1)}
        >

          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText>All Tasks</ListItemText>
        </ListItem>
      </List>

      <Divider />

      <List component="nav" aria-label="Task Lists">
        {taskLists.map((taskList: TaskList, index: number) => (
          <ListItem
            button key={taskList.id}
            selected={selectedIndex === index}
            onClick={() => selectTaskList(index)}
          >

            <ListItemText>{taskList.title}</ListItemText>
          </ListItem>
        ))}
      </List>


    </div>
  );
}

export default Menu;
