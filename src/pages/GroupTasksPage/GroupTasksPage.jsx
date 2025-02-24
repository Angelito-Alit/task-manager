import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const GroupTasksPage = () => {
  const { groupId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddCollaboratorModalVisible, setIsAddCollaboratorModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);

  // Obtener las tareas del grupo
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      message.error('Error al obtener las tareas del grupo.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario es administrador
  const checkIfAdmin = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/${groupId}/collaborators`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const isUserAdmin = response.data.some(
        (collaborator) =>
          collaborator.userId._id.toString() === localStorage.getItem('userId') &&
          collaborator.role === 'admin'
      );

      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      message.error('Error al verificar permisos');
    }
  };

  // Verificar si el usuario es colaborador
  const checkIfCollaborator = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/${groupId}/collaborators`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const isUserCollaborator = response.data.some(
        (collaborator) =>
          collaborator.userId._id.toString() === localStorage.getItem('userId')
      );

      setIsCollaborator(isUserCollaborator);
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      message.error('Error al verificar permisos');
    }
  };

  useEffect(() => {
    fetchTasks();
    checkIfAdmin();
    checkIfCollaborator();
  }, [groupId]);

  // Agrupar tareas por estado
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  const taskStatuses = ['pendiente', 'en progreso', 'completada'];

  // Añadir una nueva tarea
  const handleAddTask = async (values) => {
    try {
      const formattedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
        groupId,
      };

      const response = await axios.post(
        `http://localhost:5000/api/groups/${groupId}/tasks`,
        formattedValues,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setTasks([...tasks, response.data.task]);
      setIsModalVisible(false);
      message.success('Tarea agregada exitosamente.');
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
      message.error('Error al agregar la tarea.');
    }
  };

  // Editar una tarea existente
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      ...task,
      deadline: task.deadline ? moment(task.deadline) : null,
    });
  };

  // Actualizar una tarea
  const handleUpdateTask = async (values) => {
    try {
      const formattedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
      };

      const response = await axios.put(
        `http://localhost:5000/api/groups/${groupId}/tasks/${editingTask._id}`,
        formattedValues,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setTasks(tasks.map((task) => (task._id === editingTask._id ? response.data.task : task)));
      setIsEditModalVisible(false);
      form.resetFields();
      message.success('Tarea actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      message.error('Error al actualizar la tarea.');
    }
  };

  // Marcar una tarea como completada
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/groups/${groupId}/tasks/${taskId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setTasks(tasks.map((task) => (task._id === taskId ? response.data.task : task)));
      message.success('Tarea marcada como completada.');
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      message.error('Error al completar la tarea.');
    }
  };

  // Agregar un colaborador
  const handleAddCollaborator = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/groups/${groupId}/collaborators`,
        { email: values.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      message.success('Colaborador agregado exitosamente.');
      setIsAddCollaboratorModalVisible(false);
    } catch (error) {
      console.error('Error al agregar colaborador:', error);
      message.error('Error al agregar colaborador.');
    }
  };

  return (
    <div>
      <h1 style={{ color: '#D35400' }}>Tareas del Grupo</h1>

      {isAdmin && (
        <div style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ background: '#E67E22', borderColor: '#E67E22', marginRight: '8px' }}
          >
            Agregar Tarea
          </Button>
          <Button
            type="primary"
            onClick={() => setIsAddCollaboratorModalVisible(true)}
            style={{ background: '#E67E22', borderColor: '#E67E22' }}
          >
            Agregar Colaborador
          </Button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px' }}>
        {taskStatuses.map((taskStatus) => (
          <Card
            key={taskStatus}
            title={taskStatus.toUpperCase()}
            style={{ flex: 1, background: '#f0f2f5' }}
          >
            {groupedTasks[taskStatus]?.map((task) => (
              <Card
                key={task._id}
                style={{ marginBottom: '8px' }}
              >
                <h4>{task.name}</h4>
                <p>{task.description}</p>
                <p><strong>Categoría:</strong> {task.category}</p>
                <p><strong>Fecha límite:</strong> {new Date(task.deadline).toLocaleString()}</p>
                <p><strong>Asignado a:</strong> {task.assignedTo?.username || 'Sin asignar'}</p>
                <p><strong>Creada por:</strong> {task.createdBy?.username}</p>
                {isAdmin && (
                  <Button
                    style={{ background: '#E67E22', borderColor: '#E67E22', marginRight: '8px' }}
                    onClick={() => handleEditTask(task)}
                  >
                    Editar
                  </Button>
                )}
                {isCollaborator && task.status !== 'completada' && (
                  <Button
                    type="primary"
                    onClick={() => handleCompleteTask(task._id)}
                  >
                    Completar
                  </Button>
                )}
              </Card>
            ))}
          </Card>
        ))}
      </div>

      {/* Modal para añadir tarea */}
      <Modal
        title="Agregar Nueva Tarea"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddTask} layout="vertical">
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
              Agregar Tarea
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para editar tarea */}
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

      {/* Modal para agregar colaborador */}
      <Modal
        title="Agregar Colaborador"
        visible={isAddCollaboratorModalVisible}
        onCancel={() => setIsAddCollaboratorModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddCollaborator} layout="vertical">
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[{ required: true, message: 'Por favor ingresa el correo electrónico' }]}
          >
            <Input placeholder="Correo electrónico del colaborador" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#E67E22', borderColor: '#E67E22' }}>
              Agregar Colaborador
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupTasksPage;