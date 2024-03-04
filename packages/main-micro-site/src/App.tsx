import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const layoutStyle = {
  width: '100%',
  height: '100vh'
};

function App() {

  return (
    <Layout style={layoutStyle}>
      <Header >Header</Header>
      <Layout>
        <Sider width="25%">
          Sider
        </Sider>
        <Content >Content</Content>
      </Layout>
      <Footer >Footer</Footer>
    </Layout>
  )
}

export default App
