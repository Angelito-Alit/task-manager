import React, { useState, useEffect } from 'react';
import { List, Card, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/groups', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error('Error al obtener los grupos:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/groups', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGroups([...groups, response.data.group]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };

  return (
    <div>
      <h1>Grupos</h1>

      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '16px' }}
      >
        Crear Grupo
      </Button>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={groups}
        renderItem={(group) => {
          if (!group.groupId) {
            return null; // Evitar errores si group.groupId es null
          }

          return (
            <List.Item key={group.groupId._id}>
              <Link to={`/groups/${group.groupId._id}`}>
                <Card title={group.groupId.name}>
                  <p>Administrador: {group.groupId.admin.username}</p>
                </Card>
              </Link>
            </List.Item>
          );
        }}
      />

      <Modal
        title="Crear Grupo"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre del Grupo"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del grupo' }]}
          >
            <Input placeholder="Nombre del grupo" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Crear Grupo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupsPage;