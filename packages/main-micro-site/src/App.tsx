import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';
import { MenuContainer } from './components/menu.tsx';
import { colors } from './assets/css/colors.ts';

const {
  Header, Footer, Sider, Content,
} = Layout;

const layoutStyle = {
  width: '100%',
  height: '100vh',
};

const siderStyle = {
  background: colors.headerBack,
};
const footerStyle = {
  background: colors.headerBack,
  borderTop: '1px solid #e8e8e8',
};
const headerStyle = {
  background: colors.headerBack,
};

function App() {
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        Header
      </Header>
      <Layout>
        <Sider width="10%" style={siderStyle}>
          <MenuContainer />
        </Sider>
        <Content style={{ background: colors.white }}>
          <Outlet />
        </Content>
      </Layout>
      <Footer className="flex-container center" style={footerStyle}>
        micro basic
      </Footer>
    </Layout>
  );
}

export default App;
