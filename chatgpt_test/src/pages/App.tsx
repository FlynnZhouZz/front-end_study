import React from 'react';
import { Container } from '@material-ui/core';

import Chat from '@/components/chat';
import Send from '@/components/send';

import '@/styles/index.scss';

function App() {
    return (
        <Container maxWidth='sm'>
            <Chat type={1} name='You' />
            <Send key='1' />
        </Container>
    );
}

export default App;
