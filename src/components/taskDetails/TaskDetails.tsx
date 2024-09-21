import React from "react";
import { Modal } from "antd";

interface TaskDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  task: {
    title: string;
    description: string;
    createdAt: string;
    dueDate: string;
  };
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  onClose,
  task,
}) => {
  return (
    <Modal
      title="Task Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <h3>{task.title}</h3>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Created At:</strong> {task.createdAt}</p>
      <p><strong>Due Date:</strong> {task.dueDate}</p>
    </Modal>
  );
};

export default TaskDetailsModal;
