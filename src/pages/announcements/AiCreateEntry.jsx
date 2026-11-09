import { useState } from 'react';
import styled from 'styled-components';
import { Input, Upload, notification } from 'antd';
import { FileImageOutlined, FormOutlined } from '@ant-design/icons';
import { func } from 'prop-types';

import Button from '../../components/Button';
import { fileToCompressedImagePayload, parseAnnouncementDraft } from '../../utils/aiAnnouncement.utils';

const { TextArea } = Input;
const { Dragger } = Upload;

const Container = styled.div`
  padding: var(--space-5) var(--space-4) var(--space-4);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-5);
`;

const Notice = styled.div`
  padding: var(--space-3) var(--space-4);
  border-radius: 12px;
  background: ${({ $error }) => ($error ? 'rgba(176, 65, 62, 0.08)' : 'rgba(49, 112, 142, 0.08)')};
  color: ${({ $error }) => ($error ? 'var(--color-alert)' : 'var(--color-primary)')};
  font-size: 0.9em;
  line-height: 1.4;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: var(--space-2);
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: var(--color-black-2);
  font-size: 0.95em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .anticon {
    color: var(--color-primary);
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-grey-1);
  font-size: 0.85em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 1px solid var(--color-grey-3);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-2);
`;

const StyledDragger = styled(Dragger)`
  && {
    border-radius: 14px !important;
    background: var(--color-white-2) !important;
    border-color: var(--color-grey-3) !important;
  }

  .ant-upload-drag-icon {
    margin-bottom: var(--space-2);
  }

  .ant-upload-text {
    color: var(--color-black-2) !important;
    font-weight: 600;
  }

  .ant-upload-hint {
    color: var(--color-grey-1) !important;
  }
`;

function AiCreateEntry({ onDraft }) {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const runDraft = async (payload) => {
    setIsGenerating(true);
    setErrorMessage('');

    try {
      const draft = await parseAnnouncementDraft(payload);
      if (!draft.title && !draft.message && !draft.endDate) {
        throw new Error('AI could not find enough details. Try again or fill the form yourself.');
      }
      onDraft(draft);
    } catch (error) {
      const message = error?.message?.replace(/^Firebase: /, '') || 'AI draft failed. You can fill the form yourself.';
      setErrorMessage(message);
      notification.error({
        message: 'Could not draft from AI',
        description: message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImage = async (file) => {
    try {
      const imagePayload = await fileToCompressedImagePayload(file);
      await runDraft({
        ...imagePayload,
        text: text.trim(),
      });
    } catch (error) {
      setErrorMessage(error.message || 'Could not read that image.');
    }

    return false;
  };

  const handlePasteGenerate = async () => {
    if (!text.trim()) {
      setErrorMessage('Paste or describe the announcement first.');
      return;
    }

    await runDraft({ text: text.trim() });
  };

  return (
    <Container>
      <Notice $error={Boolean(errorMessage)}>
        {errorMessage ||
          'Upload a flyer or paste details. AI drafts the form for you to review before it goes to the Bishopric.'}
      </Notice>

      <Section>
        <SectionTitle>
          <FileImageOutlined /> Upload flyer
        </SectionTitle>
        <StyledDragger
          accept="image/*"
          multiple={false}
          showUploadList={false}
          disabled={isGenerating}
          beforeUpload={handleImage}
          customRequest={() => undefined}
        >
          <p className="ant-upload-drag-icon">
            <FileImageOutlined style={{ color: 'var(--color-primary)', fontSize: 28 }} />
          </p>
          <p className="ant-upload-text">Drop a photo here, or click to choose</p>
          <p className="ant-upload-hint">JPEG, PNG, or WebP</p>
        </StyledDragger>
      </Section>

      <OrDivider>or</OrDivider>

      <Section>
        <SectionTitle>
          <FormOutlined /> Paste or describe
        </SectionTitle>
        <TextArea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={6}
          disabled={isGenerating}
          placeholder="Paste the announcement text, or describe it in a few sentences…"
          maxLength={8000}
          showCount
          style={{ borderRadius: 12 }}
        />
        <Actions>
          <Button size="large" color="primary" htmlType="button" loading={isGenerating} onClick={handlePasteGenerate}>
            Create draft
          </Button>
        </Actions>
      </Section>
    </Container>
  );
}

AiCreateEntry.propTypes = {
  onDraft: func.isRequired,
};

export default AiCreateEntry;
