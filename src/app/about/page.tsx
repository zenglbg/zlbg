'use client';
import MainLayout from '@/components/layout/MainLayout';
import { Typography, Card, Space, Divider } from 'antd';
import { PhoneOutlined, MailOutlined, GithubOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
 

export default function About() {
  return (
    <MainLayout>
      <Space direction="vertical" size="large" className="w-full">
        <Title level={2}>关于我</Title>
        
        <Card className="w-full">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Title level={3}>单曲循环</Title>
              <Space size="large">
                <Text><PhoneOutlined /> 13266863616</Text>
                <Text><MailOutlined /> zenglbg@gmail.com</Text>
                {/* <Text>
                  <a 
                    href="https://zenglbg.github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <GithubOutlined /> zenglbg.github.com
                  </a>
                </Text> */}
              </Space>
            </div>

            <Divider />

            <div>
              <Title level={4}>专业技能</Title>
              <Space direction="vertical">
                <div>
                  <Title level={5}>前端工程师</Title>
                  <Paragraph>
                    - 精通 React、Vue、TypeScript 等现代前端技术栈
                    - 熟练使用 Next.js、Webpack、Vite 等构建工具
                    - 具备良好的前端工程化实践经验
                    - 注重用户体验和性能优化
                  </Paragraph>
                </div>

                <div>
                  <Title level={5}>运维工程师</Title>
                  <Paragraph>
                    - 熟练使用 Linux、Docker、Kubernetes
                    - 具备 CI/CD 流程设计和实现经验
                    - 掌握自动化部署和监控技术
                    - 具备故障排查和系统优化能力
                  </Paragraph>
                </div>

                <div>
                  <Title level={5}>Flutter 工程师</Title>
                  <Paragraph>
                    - 熟练掌握 Flutter 跨平台开发
                    - 具备 iOS 和 Android 原生开发经验
                    - 注重应用性能优化和用户体验
                    - 有丰富的应用开发和上线经验
                  </Paragraph>
                </div>
              </Space>
            </div>

            <Divider />

            <div>
              <Title level={4}>工作经历</Title>
              <Paragraph>
                多年互联网行业经验，参与过多个大型项目的开发和维护工作。擅长技术攻坚和团队协作，
                具备从需求分析到项目交付的全流程经验。持续关注技术发展，保持学习和成长。
              </Paragraph>
            </div>
          </Space>
        </Card>
      </Space>
    </MainLayout>
  );
}