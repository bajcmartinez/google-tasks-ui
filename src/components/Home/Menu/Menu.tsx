import React, { useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Task, TaskList } from '../../../types/google'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'
import ListIcon from '@material-ui/icons/List'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { NameModal } from '../TaskLists/NameModal'

interface IProps {
  taskLists: TaskList[],
  selectedTaskListChanged: (id: string, title: string) => void
  insertTaskList: (taskList: TaskList) => void
  switchDarkMode: () => void
}

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,

  faIcon: {
    width: '1em',
    height: '1em',
    fontSize: '1.5rem'
  }
}))

const Menu: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { taskLists, selectedTaskListChanged, switchDarkMode } = props;

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [editingTaskList, setEditingTaskList] = useState(false);

  const selectTaskList = (index: number) => {
    setSelectedIndex(index)
    if (index >= 0)
      selectedTaskListChanged(taskLists[index].id, taskLists[index].title)
    else
      selectedTaskListChanged('all', 'All Tasks')
  };

  const handleDarkMode = () => {
    switchDarkMode();
  };

  const handleInsertTaskList = (): void => {
    setEditingTaskList(true);
  };

  const insertTaskList = (name: string): void => {
    if (name) {
      props.insertTaskList({
        title: name,
      } as Task);

      setEditingTaskList(false);
    }
  }

  return (
    <div>
      <div className={classes.toolbar}/>

      <NameModal open={editingTaskList} handleClose={() => setEditingTaskList(false)} handleSaveTaskList={insertTaskList} />

      <Divider/>

      <List component="nav" aria-label="Main Actions">
        <ListItem
          button
          selected={selectedIndex === -1}
          onClick={() => selectTaskList(-1)}
        >

          <ListItemIcon>
            <ListIcon/>
          </ListItemIcon>
          <ListItemText>All Tasks</ListItemText>
        </ListItem>
      </List>

      <Divider/>

      <List component="nav" aria-label="Task Lists">
        <ListSubheader>
          Task Lists

          <ListItemSecondaryAction>
            <IconButton onClick={handleInsertTaskList}>
              <AddIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListSubheader>

        {taskLists.map((taskList: TaskList, index: number) => (
          <ListItem
            button
            key={taskList.id}
            data-test-id={`menu-tasklist-id=${taskList.id}`}
            selected={selectedIndex === index}
            onClick={() => selectTaskList(index)}
          >

            <ListItemText>{taskList.title}</ListItemText>
          </ListItem>
        ))}
      </List>

      <Divider/>

      <List component="nav" aria-label="Task Lists">
        <ListSubheader>
          Others
        </ListSubheader>

        <ListItem>
          <ListItemIcon>
            <FontAwesomeIcon icon={faAdjust} className={classes.faIcon} />
          </ListItemIcon>
          <ListItemText>Dark Mode</ListItemText>

          <ListItemSecondaryAction>
            <Switch
              edge="end"
              data-test-id="menu-dark-mode"
              checked={localStorage.getItem("settings.darkMode") === "true"}
              onChange={() => handleDarkMode()}
              inputProps={{ 'aria-labelledby': 'switch-list-label-darkMode' }}
            />
          </ListItemSecondaryAction>
        </ListItem>

        <ListItem
          button
          component="a"
          href="https://github.com/bajcmartinez/google-tasks-ui"
          target="_blank"
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faGithub} className={classes.faIcon} />
          </ListItemIcon>
          <ListItemText>View on GitHub</ListItemText>
        </ListItem>
      </List>
    </div>
  )
}

export default Menu
