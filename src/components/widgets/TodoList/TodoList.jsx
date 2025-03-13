import React, { useState } from 'react';

// Начальные данные
const initialData = [
  {
    id: 'work',
    title: 'Работа',
    tasks: [
      { id: 'task1', content: 'Завершить проект', priority: 1 },
      { id: 'task2', content: 'Подготовить отчет', priority: 2 },
    ],
  },
  {
    id: 'personal',
    title: 'Личное',
    tasks: [
      { id: 'task3', content: 'Купить продукты', priority: 1 },
      { id: 'task4', content: 'Позвонить другу', priority: 2 },
    ],
  },
];

const TodoList = () => {
  const [categories, setCategories] = useState(initialData);

  // Обработчик начала перетаскивания
  const handleDragStart = (e, taskId, categoryId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('categoryId', categoryId);
  };

  // Обработчик завершения перетаскивания
  const handleDrop = (e, targetCategoryId) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData('taskId');
    const sourceCategoryId = e.dataTransfer.getData('categoryId');

    if (sourceCategoryId === targetCategoryId) return;

    // Находим задачу и удаляем её из исходной категории
    const sourceCategory = categories.find((cat) => cat.id === sourceCategoryId);
    const task = sourceCategory.tasks.find((task) => task.id === taskId);
    sourceCategory.tasks = sourceCategory.tasks.filter((task) => task.id !== taskId);

    // Добавляем задачу в целевую категорию
    const targetCategory = categories.find((cat) => cat.id === targetCategoryId);
    targetCategory.tasks.push(task);

    // Обновляем состояние
    setCategories([...categories]);
  };

  // Обработчик для разрешения drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {categories.map((category) => (
        <div
          key={category.id}
          onDrop={(e) => handleDrop(e, category.id)}
          onDragOver={handleDragOver}
          style={{
            width: '300px',
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          <h2>{category.title}</h2>
          {category.tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, category.id)}
              style={{
                padding: '8px',
                margin: '8px 0',
                backgroundColor: '#f4f4f4',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'grab',
              }}
            >
              {task.content} (Приоритет: {task.priority})
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TodoList;