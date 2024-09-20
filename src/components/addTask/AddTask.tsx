import React from "react";
import { Modal, Button, Form, Input, DatePicker } from "antd";
import { useTask } from "../../hooks/useTask";
import dayjs from "dayjs";

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string; // Due date stored as a string
}

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  scenario: "Add" | "Edit";
  initialValues?: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  scenario,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { createTask, updateTask } = useTask();

  React.useEffect(() => {
    if (scenario === "Edit" && initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        description: initialValues.description,
        dueDate: initialValues.dueDate ? dayjs(initialValues.dueDate) : null,  
      });
    } else {
      form.resetFields();
    }
  }, [scenario, initialValues, form]);

  const handleSubmit = async (values: {
    title: string;
    description?: string;
    dueDate: Date | null;
  }) => {
    const { title, description, dueDate } = values;

    const newTask = {
      id: initialValues?._id,
      title,
      description: description || "",
      dueDate: dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : "",  
    };

    if (scenario === "Add") {
      createTask(newTask);
    } else {
      updateTask(newTask as any);
    }

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={scenario === "Edit" ? "Edit Task" : "Add New Task"}
      visible={visible}
      onCancel={onClose}
      footer={null}
      aria-labelledby="task-modal-title"
      aria-modal="true"
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the task title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Optional description" />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          {scenario === "Edit" ? (
            <>
              <Button
                type="default"
                onClick={onClose}
                style={{ width: "48%", marginRight: "4%" }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" style={{ width: "48%" }}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Add Task
            </Button>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
