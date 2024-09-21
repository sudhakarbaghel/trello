import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskCard from "../../components/task/Task";
import "./dashboard.scss";
import Filter from "../../components/filter/Filter";
import { Button, Skeleton, Spin, Empty } from "antd";
import TaskModal from "../../components/addTask/AddTask";
import { useTask } from "../../hooks/useTask";

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status: string;
  dueDate: string;
}

interface Column {
  title: string;
  items: Task[];
}

const Kanban: React.FC = () => {
  const {
    tasks,
    isFetchingTasks,
    fetchError,
    updateTask,
    updateTaskIsPending,
  } = useTask();

  const [columns, setColumns] = useState<Record<string, Column>>({
    "column-1": { title: "TODO", items: [] },
    "column-2": { title: "IN PROGRESS", items: [] },
    "column-3": { title: "DONE", items: [] },
  });

  const [allTasksState, setAllTasksState] = useState<Task[]>([]);
  const[searchText,setSearchText]=useState('')

  useEffect(() => {
    if (tasks && tasks.data) {
      const allTasks = tasks.data;
      setAllTasksState(allTasks);

      const todoTasks = allTasks.filter(
        (task: Task) => task.status === "pending"
      );
      const inProgressTasks = allTasks.filter(
        (task: Task) => task.status === "in-progress"
      );
      const doneTasks = allTasks.filter(
        (task: Task) => task.status === "completed"
      );

      setColumns({
        "column-1": { title: "TODO", items: todoTasks },
        "column-2": { title: "IN PROGRESS", items: inProgressTasks },
        "column-3": { title: "DONE", items: doneTasks },
      });
    }
  }, [tasks]);

  const onSearch = (searchTerm: string) => {
    if (!searchTerm) {
      const todoTasks = allTasksState.filter(
        (task: Task) => task.status === "pending"
      );
      const inProgressTasks = allTasksState.filter(
        (task: Task) => task.status === "in-progress"
      );
      const doneTasks = allTasksState.filter(
        (task: Task) => task.status === "completed"
      );

      setColumns({
        "column-1": { title: "TODO", items: todoTasks },
        "column-2": { title: "IN PROGRESS", items: inProgressTasks },
        "column-3": { title: "DONE", items: doneTasks },
      });
      return;
    }

    const filteredTasks = allTasksState.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setColumns({
      "column-1": {
        ...columns["column-1"],
        items: filteredTasks.filter((task) => task.status === "pending"),
      },
      "column-2": {
        ...columns["column-2"],
        items: filteredTasks.filter((task) => task.status === "in-progress"),
      },
      "column-3": {
        ...columns["column-3"],
        items: filteredTasks.filter((task) => task.status === "completed"),
      },
    });
  };

  const onSort = (sortOption: string) => {
    const sortedColumns = { ...columns };

    Object.entries(sortedColumns).forEach(([columnId, column]) => {
      let sortedItems = [...column.items];

      switch (sortOption) {
        case "title-asc":
          sortedItems.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title-desc":
          sortedItems.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "date-asc":
          sortedItems.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "date-desc":
          sortedItems.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "recent":
        default:
          sortedItems.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }

      sortedColumns[columnId].items = sortedItems;
    });

    setColumns(sortedColumns);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems =
      destination.droppableId === source.droppableId
        ? sourceItems
        : [...destColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);
    if (destination.droppableId !== source.droppableId) {
      destItems.splice(destination.index, 0, removed);

      const newStatus =
        destination.droppableId === "column-1"
          ? "pending"
          : destination.droppableId === "column-2"
          ? "in-progress"
          : "completed";

      const { _id, ...taskWithoutId } = removed;
      updateTask({ status: newStatus, id: _id });
    } else {
      sourceItems.splice(destination.index, 0, removed);
    }

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      ...(destination.droppableId !== source.droppableId && {
        [destination.droppableId]: { ...destColumn, items: destItems },
      }),
    });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  if (fetchError) {
    return <div>Error loading tasks</div>;
  }

  return (
    <div className="dashboard">
      <Button
        type="primary"
        className="addButton"
        onClick={() => setIsModalVisible(true)}
      >
        Add Task
      </Button>
      <TaskModal
        scenario="Add"
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <Filter onSearch={onSearch} onSort={onSort} setSearchText={setSearchText} />
      <Spin spinning={updateTaskIsPending}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="container">
            <div className="task-columns">
              {Object.entries(columns).map(([columnId, column]) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided) => (
                    <div
                      className="task-list"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <span className="title">{column.title}</span>
                      {isFetchingTasks ? (
                        <Skeleton
                          active
                          paragraph={{ rows: 4 }}
                          title={false}
                        />
                      ) : column.items.length === 0 ? (
                        <Empty description="No Tasks">
                         {!searchText? <Button
                            type="primary"
                            className="addButton"
                            onClick={() => setIsModalVisible(true)}
                          >
                            Add Task
                          </Button>:null}
                        </Empty>
                      ) : (
                        column.items.map((item, index) => (
                          <TaskCard key={item._id} item={item} index={index} />
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>
      </Spin>
    </div>
  );
};

export default Kanban;
