'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { Group, Paper, Stack, TextInput, NumberInput } from '@mantine/core';
import { TopicDataPoint } from '@/libs/types';

function useElementSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (ref.current) {
      observerRef.current = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });
      observerRef.current.observe(ref.current);

      return () => {
        if (observerRef.current && ref.current) {
          observerRef.current.unobserve(ref.current);
        }
      };
    }
  }, [ref]);

  return size;
}

interface StaticWordCloudProps {
  data: TopicDataPoint[];
}

const StaticWordCloud: React.FC<StaticWordCloudProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [topN, setTopN] = useState<number>(25);

  const paperRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(paperRef);

  const filteredBySearch = data.filter((item) =>
    item.concept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = filteredBySearch.sort((a, b) => b.publication_count - a.publication_count);
  const topTopics = sortedData.slice(0, topN);

  const words = topTopics.map((item) => ({
    text: item.concept,
    value: item.publication_count,
  }));

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });
  
  const fontSizeSetter = (datum: { value: number }) => fontScale(datum.value);
  const colors = ['#143059', '#2F6B9A', '#82a6c2'];

  return (
    <Stack gap="md">
      <Group gap="sm">
        <TextInput
          label="Search topics"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <NumberInput
          label="Show top N topics"
          value={topN}
          onChange={(value) => {
            if (typeof value === 'string') {
              setTopN(parseInt(value, 10) || 0);
            } else {
              setTopN(value);
            }
          }}
          min={1}
          max={sortedData.length}
          style={{ width: 200 }}
        />
      </Group>

      <Paper
        ref={paperRef}
        shadow="sm"
        style={{
          width: '100%',
          height: 'calc(100vh - 625px)',
          overflow: 'hidden',
          position: 'relative',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {width > 0 && height > 0 && (
          <Wordcloud
            words={words}
            width={width}
            height={height}
            fontSize={fontSizeSetter}
            font="Impact"
            padding={2}
            rotate={0}
          >
            {(cloudWords) => (
              <g>
                {cloudWords.map((w, i) => (
                  <Text
                    key={w.text}
                    fill={colors[i % colors.length]}
                    textAnchor="middle"
                    transform={`translate(${w.x}, ${w.y})`}
                    fontSize={w.size}
                    fontFamily={w.font}
                  >
                    {w.text}
                  </Text>
                ))}
              </g>
            )}
          </Wordcloud>
        )}
      </Paper>
    </Stack>
  );
};

export default StaticWordCloud;