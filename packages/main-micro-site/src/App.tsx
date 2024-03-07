import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';
import { Menu } from './components/menu.tsx';

const {
  Header, Footer, Sider, Content,
} = Layout;

const layoutStyle = {
  width: '100%',
  height: '100vh',
};

function App({ children }: { children: ReactNode }) {
  return (
    <Layout style={layoutStyle}>
      <Header>
        Header
      </Header>
      <Layout>
        <Sider width="10%">
          <Menu />
        </Sider>
        <Content>
          {children}
        </Content>
      </Layout>
      <Footer className="flex-container center">
        micro basic
      </Footer>
    </Layout>
  );
}

export default App;
