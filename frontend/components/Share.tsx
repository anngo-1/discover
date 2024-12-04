import { FC, useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Group,
  TextInput,
  ActionIcon,
  CopyButton,
  Text,
  Stack
} from '@mantine/core';
import { IconShare, IconCheck, IconCopy } from '@tabler/icons-react';
import { encodeFilters } from '../utils/filterCompression';
import { FilterState } from '@/libs/types';

interface ShareModalProps {
  currentFilters: FilterState;
}

const ShareModal: FC<ShareModalProps> = ({ currentFilters }) => {
  const [opened, setOpened] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const baseURL = window.location.origin + window.location.pathname;
    const encoded = encodeFilters(currentFilters);
    setUrl(`${baseURL}?f=${encoded}`);
  }, [currentFilters]);

  return (
    <>
      <Button
        variant="light"
        size="sm"
        leftSection={<IconShare size="1.1rem" />}
        onClick={() => setOpened(true)}
      >
        Share
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Share Dashboard View"
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            Share this link with others to show them your exact dashboard view, including all your current filters and settings.
          </Text>
          <Group>
            <TextInput
              value={url}
              readOnly
              style={{ flex: 1 }}
              placeholder="Loading URL..."
            />
            <CopyButton value={url} timeout={2000}>
              {({ copied, copy }) => (
                <ActionIcon
                  color={copied ? 'teal' : 'blue'}
                  variant="filled"
                  onClick={copy}
                  title={copied ? 'Copied!' : 'Copy to clipboard'}
                >
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ShareModal;