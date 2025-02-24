import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Input, DatePicker, Select } from 'antd';
import axios from 'axios';
import AddTaskModal from '../AddTaskModal/AddTaskModal.jsx';
import moment from 'moment';

const { Option } = Select;

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      ...task,
      deadline: task.deadline ? moment(task.deadline) : null,
    });
  };

  const handleUpdateTask = async (values) => {
    try {
      const formattedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
      };

      const response = await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, formattedValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTasks(tasks.map(task => task._id === editingTask._id ? response.data.task : task));
      setIsEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  const statuses = ['pendiente', 'en progreso', 'completada'];

  return (
    <div>
      <h1 style={{ color: '#D35400' }}>Dashboard</h1>

      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ background: '#E67E22', borderColor: '#E67E22', marginBottom: '16px' }}
      >
        Agregar Tarea
      </Button>

      <div style={{ display: 'flex', gap: '16px' }}>
        {statuses.map((status) => (
          <Card
            key={status}
            title={status.toUpperCase()}
            style={{ flex: 1, background: '#f0f2f5' }}
          >
            {groupedTasks[status]?.map((task) => (
              <Card
                key={task._id}
                style={{ marginBottom: '8px' }}
              >
                <h4>{task.name}</h4>
                <p>{task.description}</p>
                <p><strong>Categoría:</strong> {task.category}</p>
                <p><strong>Fecha límite:</strong> {new Date(task.deadline).toLocaleString()}</p>
                <Button  style={{ background: '#E67E22', borderColor: '#E67E22' }} onClick={() => handleEditTask(task)}>Editar</Button>
              </Card>
            ))}
          </Card>
        ))}
      </div>

      <AddTaskModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAddTask={handleAddTask}
      />

      <Modal
        title="Editar Tarea"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateTask} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre de la tarea' }]}
          >
            <Input placeholder="Nombre de la tarea" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
          >
            <Select placeholder="Selecciona el estado">
              <Option value="pendiente">Pendiente</Option>
              <Option value="en progreso">En Progreso</Option>
              <Option value="completada">Completada</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
          >
            <Input.TextArea placeholder="Descripción de la tarea" />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Fecha Límite"
          >
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Categoría"
          >
            <Input placeholder="Categoría de la tarea" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#E67E22', borderColor: '#E67E22' }}>
              Actualizar Tarea
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;