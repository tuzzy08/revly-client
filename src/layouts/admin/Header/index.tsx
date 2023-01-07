import * as React from 'react';
import { ActionIcon, createStyles, MediaQuery, Burger, Group, Header, useMantineTheme, } from '@mantine/core';

interface Props {
  // children: React.ReactNode,
  opened: boolean;
  setOpened: any
}
export default function AdminLayoutHeader({ opened, setOpened }: Props) {
  const theme = useMantineTheme();
  return (
    <Header height={{ base: 50, md: 60 }} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o: boolean) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />            
        </MediaQuery>
      {/* {children} */}
      </div>
    </Header>)
}