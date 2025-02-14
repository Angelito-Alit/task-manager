import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials] = useState({ username: 'admin', password: '1234' });
  const navigate = useNavigate();

  const onFinish = (values) => {
    if (values.username === credentials.username && values.password === credentials.password) {
      navigate('/dashboard');
    } else {
      alert('¡Credenciales incorrectas! Intenta de nuevo.');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '40px', 
      backgroundColor: '#FFF', 
      borderRadius: '10px', 
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
      textAlign: 'center'
    }}>
      <h2 style={{ 
        color: '#D35400', 
        fontSize: '24px', 
        marginBottom: '20px', 
        fontWeight: 'bold'
      }}>
        Iniciar Sesión
      </h2>
      <Form onFinish={onFinish}>
        <Form.Item 
          name="username" 
          rules={[{ required: true, message: 'Ingresa tu usuario' }]}
        >
          <Input 
            placeholder="Usuario" 
            style={{ 
              borderRadius: '5px', 
              padding: '10px', 
              fontSize: '16px' 
            }} 
          />
        </Form.Item>
        <Form.Item 
          name="password" 
          rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
        >
          <Input.Password 
            placeholder="Contraseña" 
            style={{ 
              borderRadius: '5px', 
              padding: '10px', 
              fontSize: '16px' 
            }} 
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            style={{ 
              backgroundColor: '#E67E22', 
              borderColor: '#D35400', 
              borderRadius: '5px', 
              padding: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold'
            }}
          >
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
      <p style={{ 
        color: '#34495E', 
        marginTop: '20px', 
        fontSize: '14px'
      }}>
        ¿No tienes una cuenta? <a href="#" style={{ color: '#D35400' }}>Regístrate</a>
      </p>
    </div>
  );
};

export default LoginPage;