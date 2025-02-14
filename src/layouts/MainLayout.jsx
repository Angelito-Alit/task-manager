import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ backgroundColor: '#D35400' }}>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ backgroundColor: '#D35400' }}>
          <Menu.Item key="1">
            <Link to="/dashboard">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/dashboard/tasks">Tareas</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/dashboard/settings">Configuración</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#E67E22', padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#FFF', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;