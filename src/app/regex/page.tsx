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

  const columns = [
    {
      title: '匹配内容',
      dataIndex: 'match',
      key: 'match',
    },
    {
      title: '位置',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '捕获组',
      dataIndex: 'groups',
      key: 'groups',
      render: (groups: string[]) => groups.length ? groups.join(', ') : '-'
    },
  ];

  return (
    <MainLayout>
      <Space direction="vertical" size="large" className="w-full">
        <Title level={4}>正则表达式测试工具</Title>

        <Card title="正则表达式">
          <Space direction="vertical" className="w-full">
            <Input
              placeholder="输入正则表达式，如: \w+"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              status={error ? 'error' : ''}
            />
            <div className="flex items-center gap-4">
              <Space>
                <Switch
                  checked={flags.includes('g')}
                  onChange={(checked) => setFlags(checked ? flags + 'g' : flags.replace('g', ''))}
                  checkedChildren="g"
                  unCheckedChildren="g"
                />
                <Switch
                  checked={flags.includes('i')}
                  onChange={(checked) => setFlags(checked ? flags + 'i' : flags.replace('i', ''))}
                  checkedChildren="i"
                  unCheckedChildren="i"
                />
                <Switch
                  checked={isMultiline}
                  onChange={setIsMultiline}
                  checkedChildren="m"
                  unCheckedChildren="m"
                />
              </Space>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </Space>
        </Card>

        <Card title="测试文本">
          <TextArea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入要测试的文本"
          />
        </Card>

        <Card title={`匹配结果 (${results.length})`}>
          <Table 
            columns={columns} 
            dataSource={results}
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>
      </Space>
    </MainLayout>
  );
}