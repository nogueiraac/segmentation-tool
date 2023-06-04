import React from "react";

import { Layout } from "antd";

import Menu from "../Menu";

const { Content } = Layout;

const Dashboard: React.FC = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Menu />
      <Layout>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
