'use client';
import MainLayout from '@/components/layout/MainLayout';
import { Layout, Typography, Space, Input, Card, Table, Switch } from 'antd';
import { useState, useEffect } from 'react';

const { TextArea } = Input;
const { Title } = Typography;

interface MatchResult {
  key: number;
  match: string;
  index: number;
  groups: string[];
}



export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState('');
  const [isMultiline, setIsMultiline] = useState(false);

  useEffect(() => {
    try {
      if (!pattern || !text) {
        setResults([]);
        setError('');
        return;
      }

      const regex = new RegExp(pattern, flags + (isMultiline ? 'm' : ''));
      const matches: MatchResult[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            key: matches.length,
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(text);
        if (match) {
          matches.push({
            key: 0,
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setResults(matches);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setResults([]);
    }
  }, [pattern, text, flags, isMultiline]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex items-center justify-between">
            <Title level={4}>正则表达式测试工具</Title>
            <Card className="bg-gray-50">
              <Space>
                <Switch
                  checked={flags.includes('g')}
                  onChange={(checked) => setFlags(checked ? flags + 'g' : flags.replace('g', ''))}
                  checkedChildren="全局匹配 (g)"
                  unCheckedChildren="g"
                />
                <Switch
                  checked={flags.includes('i')}
                  onChange={(checked) => setFlags(checked ? flags + 'i' : flags.replace('i', ''))}
                  checkedChildren="忽略大小写 (i)"
                  unCheckedChildren="i"
                />
                <Switch
                  checked={isMultiline}
                  onChange={setIsMultiline}
                  checkedChildren="多行模式 (m)"
                  unCheckedChildren="m"
                />
              </Space>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              title="正则表达式"
              className="shadow-sm"
              extra={error && <span className="text-red-500 text-sm">{error}</span>}
            >
              <Input
                placeholder="输入正则表达式，如: \w+"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                status={error ? 'error' : ''}
                className="text-lg font-mono"
                size="large"
              />
            </Card>

            <Card 
              title="测试文本" 
              className="shadow-sm"
            >
              <TextArea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入要测试的文本"
                className="font-mono"
              />
            </Card>
          </div>

          <Card 
            title={`匹配结果 (${results.length})`}
            className="shadow-sm"
          >
            <Table 
              columns={[
                {
                  title: '匹配内容',
                  dataIndex: 'match',
                  key: 'match',
                  className: 'font-mono',
                },
                {
                  title: '位置',
                  dataIndex: 'index',
                  key: 'index',
                  width: 100,
                },
                {
                  title: '捕获组',
                  dataIndex: 'groups',
                  key: 'groups',
                  render: (groups: string[]) => (
                    <span className="font-mono">
                      {groups.length ? groups.join(', ') : '-'}
                    </span>
                  )
                },
              ]}
              dataSource={results}
              pagination={false}
              scroll={{ x: true }}
              className="overflow-x-auto"
              size="middle"
            />
          </Card>
        </Space>
      </div>
    </MainLayout>
  );
}