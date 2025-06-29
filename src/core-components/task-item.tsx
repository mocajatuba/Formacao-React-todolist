import React from "react";

import ButtonIcon from "../components/button-icon";
import Card from "../components/card";
import InputCheckbox from "../components/input-checkbox";
import Text from "../components/text";
import { TaskState, type Task } from "../models/task";

import TrashIcon from "../assets/icons/trash.svg?react";
import CheckIcon from "../assets/icons/check.svg?react";
import PencilIcon from "../assets/icons/pencil.svg?react";
import XIcon from "../assets/icons/x.svg?react";
import InputText from "../components/input-text";
import { cx } from "class-variance-authority";
import useTask from "../hooks/use-task";

interface TaskItemProps {
    task: Task
}

export function TaskItem({task}: TaskItemProps) {
    const [isEditing, setIsEditing] = React.useState(
        task?.state === TaskState.Creating
    );

    const [taskTitle, setTaskTitle] = React.useState(task.title || "");
    const { updateTask, updateTaskStatus, deleteTask } = useTask();

    function handleEditTask() {
        setIsEditing(true)
    }

    function handleExitEditTask() {
        if (task.state === TaskState.Creating) {
            deleteTask(task.id)
        }
    }

    function handleChangeTaskTitle(e: React.ChangeEvent<HTMLInputElement>) {
        setTaskTitle(e.target.value || "")
    }

    function handleSaveTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // chamada para funçao de atualizar
        updateTask(task.id, {title: taskTitle})

        setIsEditing(false);
    }

    function handleChangeTaskStatus(e: React.ChangeEvent<HTMLInputElement>) {
        
        const checked = e.target.checked;

        updateTaskStatus(task.id, checked)

    }

    function handleDeleteTask() {
        deleteTask(task.id)
    }

    return (
        <Card size="md">
            {!isEditing ? (
                <div  className="flex items-center gap-4">
                    <InputCheckbox 
                        checked={task?.concluded}
                        onChange={handleChangeTaskStatus}
                    />
                    <Text className={cx("flex-1",
                        {"line-through": task?.concluded,})}
                    >
                        {task?.title}
                    </Text>
                    <div className="flex gap-1">
                        <ButtonIcon 
                            icon={TrashIcon} 
                            variant="tertiary" 
                            onClick={handleDeleteTask}
                        />
                        <ButtonIcon 
                            icon={PencilIcon} 
                            variant="tertiary" 
                            onClick={handleEditTask}/>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSaveTask} className="flex items-center gap-4">
                    <InputText 
                        value={taskTitle}
                        className="flex-1" 
                        onChange={handleChangeTaskTitle} 
                        required
                        autoFocus
                    />
                    <div className="flex gap-1">
                        <ButtonIcon 
                            type="button" 
                            icon={XIcon} 
                            variant="secondary" 
                            onClick={handleExitEditTask}
                        />
                        <ButtonIcon 
                            type="submit" 
                            icon={CheckIcon} 
                            variant="primary" />
                    </div>
                </form>
            )}
        </Card>
    )
}