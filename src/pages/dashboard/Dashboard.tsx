import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskCard from "../../components/task/Task";
import "./dashboard.scss";
import Filter from "../../components/filter/Filter";
import { Button } from "antd";
import TaskModal from "../../components/addTask/AddTask";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../../api/task";

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status: string;
  dueDate:string;
}

interface Column {
  title: string;
  items: Task[];
}

const Kanban: React.FC = () => {
  const {
    data: tasksData,
    isLoading,
    error,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  const [columns, setColumns] = useState<Record<string, Column>>({
    "column-1": { title: "TODO", items: [] },
    "column-2": { title: "IN PROGRESS", items: [] },
    "column-3": { title: "DONE", items: [] },
  });

  useEffect(() => {
    if (tasksData && tasksData.data) {
      const todoTasks = tasksData.data.filter((task: Task) => task.status === "pending");
      const inProgressTasks = tasksData.data.filter((task: Task) => task.status === "in-progress");
      const doneTasks = tasksData.data.filter((task: Task) => task.status === "done");

      setColumns({
        "column-1": { title: "TODO", items: todoTasks },
        "column-2": { title: "IN PROGRESS", items: inProgressTasks },
        "column-3": { title: "DONE", items: doneTasks },
      });
    }
  }, [tasksData]);

  const onSearch = (searchTerm: string) => {
    const allTasks = [...columns["column-1"].items, ...columns["column-2"].items, ...columns["column-3"].items];
    const filtered = allTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Update columns with filtered data
    setColumns({
      "column-1": { ...columns["column-1"], items: filtered.filter(task => task.status === "pending") },
      "column-2": { ...columns["column-2"], items: filtered.filter(task => task.status === "in-progress") },
      "column-3": { ...columns["column-3"], items: filtered.filter(task => task.status === "done") },
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
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "date-desc":
          sortedItems.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "recent":
        default:
          sortedItems.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
    const destItems = [...destColumn.items];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    } else {
      const [removed] = sourceItems.splice(source.index, 1);
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
      });
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks</div>;
  }

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Task
      </Button>
      <TaskModal
        scenario="Add"
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <Filter onSearch={onSearch} onSort={onSort} />
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
                    {column.items.map((item, index) => (
                      <TaskCard key={item._id} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
