import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { Draggable } from "react-beautiful-dnd";
import TaskModal from "../../components/addTask/AddTask";
import TaskDetailsModal from "../../components/taskDetails/TaskDetails";  
import { useTask } from "../../hooks/useTask";
import "./task.scss";

interface TaskProps {
  item: {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    dueDate: string;
  };
  index: number;
}

const Task: React.FC<TaskProps> = ({ item, index }) => {
  const { _id, title, description, createdAt, dueDate } = item;

  const [isModalVisible, setModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false); 
  const { deleteTask, deleteTaskIsPending } = useTask();

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleDelete = async () => {
    await deleteTask(_id);
  };

  const handleViewDetails = () => {
    setDetailsModalVisible(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalVisible(false);
  };

  return (
    <Draggable key={_id} draggableId={_id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task_card"
        >
          <div className="task_top">
            <h3 className="task_title">{title}</h3>
            <p className="task_description">{description}</p>
          </div>
          <div className="task_bottom">
            <p className="task_created_at">Created at: {createdAt}</p>
            <p className="task_created_at">Due date: {dueDate}</p>
            <div className="task_actions">
              <Popconfirm
                title="Are you sure to delete this task?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  className="task_button"
                >
                  Delete
                </Button>
              </Popconfirm>
              <Button
                type="default"
                className="task_button"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                type="primary"
                className="task_button"
                onClick={handleViewDetails} // Open details modal
              >
                View Details
              </Button>
            </div>
          </div>

          <TaskModal
            visible={isModalVisible}
            onClose={handleClose}
            scenario="Edit"
            initialValues={{
              ...item,
              dueDate: dueDate || "",
            }}
          />

          {/* Details Modal */}
          <TaskDetailsModal
            visible={isDetailsModalVisible}
            onClose={handleCloseDetails}
            task={{ title, description, createdAt, dueDate }} // Pass task details
          />
        </div>
      )}
    </Draggable>
  );
};

export default Task;
