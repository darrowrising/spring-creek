import React from 'react';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import { string } from 'prop-types';
// styles
import { Container } from './PDF.styles';

function PDF({ file }) {
    const id = file.split('/').pop().split('.')[0];
    return (
        <Container id={id}>
            <Document file={file}>
                <Page pageNumber={1} />
            </Document>
        </Container>
    );
}

PDF.propTypes = {
    file: string.isRequired,
};

export default PDF;
