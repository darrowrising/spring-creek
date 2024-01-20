// #region imports
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { number, string, node, oneOfType } from 'prop-types';
import { Button } from 'antd';

import { db, docs } from '../../../utils/firebase.utils';
import { dateLongTime, programIdShort } from '../../../configs/dateFormats';
import { utc, comingSunday } from '../../../utils/date.utils';
import { bishop } from '../../../configs/unit';
// #endregion imports
// #region Values
// #region component
function Values({ value, children }) {
  if (!value) return 'TBD';
  return children;
}

Values.propTypes = {
  value: oneOfType([string, number]),
  children: node,
};
// #endregion component
// #endregion Values
// #region Lines
// #region styles
const LinesLayout = styled.div`
  padding: var(--space-1) 0 var(--space-4);
  line-height: 1.5;
  overflow: hidden;
`;
// #endregion styles
// #region component
function Lines({ lines = 4 }) {
  const line = '______________________________________________________________________________________';
  return (
    <LinesLayout>
      {Array(lines)
        .fill(line)
        .map((emptyLine, index) => (
          <div key={`line-${index + 1}`}>{emptyLine}</div>
        ))}
    </LinesLayout>
  );
}

Lines.propTypes = {
  lines: number,
};
// #endregion component
// #endregion Lines
// #region Conducting
// #region styles
const ButtonLayout = styled.div`
  text-align: right;
  transform: translate(-20px, -50px);
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);

  &:first-of-type {
    border-right: 1px solid var(--color-grey-1);
  }
`;

const Page = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  /* gap: var(--space-6); */
  border: 1px solid var(--color-grey-1);

  & h3 {
    font-size: 1em;
  }

  & p {
    margin: 0;
  }
`;

const Words = styled.p`
  line-height: 1.2;
  font-size: 0.8em;
`;

const SubHeading = styled.h3`
  padding-bottom: var(--space-2);
`;

const ProgramList = styled.div`
  line-height: 1.5;
`;
// #endregion styles
// #region utils
const buildProgramItem = ({ title, value, type }) => {
  if (type === 'meeting') return <strong>{value}</strong>;
  if (type === 'music')
    return (
      <div style={{ padding: 'var(--space-2) 0' }}>
        <h5
          style={{
            borderBottom: '1px dashed var(--color-grey-1)',
            paddingBottom: 'var(--space-1)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Musical Number
        </h5>
        <div>
          <strong>Title</strong>: <em>"{title}"</em>
        </div>
        <div>{value}</div>
      </div>
    );
  if (type === 'hymn')
    return (
      <div>
        <strong>Intermediate Hymn: </strong> #{value} - {title}
      </div>
    );
  return (
    <div>
      <strong>{title}:</strong> {value}
    </div>
  );
  console.log('type:', type);
};
// #endregion utils
let unsubscribe = null; // eslint-disable-line

const initialState = {
  date: utc({ date: comingSunday(), format: dateLongTime }),
  presiding: bishop,
  program: [
    {
      type: 'talk',
      title: 'Speaker',
      value: 'TBA',
    },
  ],
};

// #region component
function Conducting() {
  const [program, setProgram] = useState(initialState);

  const {
    presiding,
    organist,
    chorister,
    opening_hymn,
    opening_hymn_title,
    invocation,
    sacrament_hymn,
    sacrament_hymn_title,
    program: speakers,
    closing_hymn,
    closing_hymn_title,
    closing_hymn_extra,
    benediction,
  } = program;

  const onPrint = () => window.print();

  useEffect(() => {
    const id = utc({ date: comingSunday(), format: programIdShort });

    unsubscribe = db
      .collection('program')
      .where('id', '==', id)
      .onSnapshot((programSnap) => {
        const data = docs(programSnap)[0];

        if (data) {
          setProgram({
            ...data,
            date: utc({ date: data.date, format: dateLongTime }),
          });
        }
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ButtonLayout className="print-button">
        <Button htmlType="button" onClick={onPrint}>
          Print
        </Button>
      </ButtonLayout>
      <Page id="conductingPage">
        <Col>
          <h3>Welcome Everyone</h3>
          <div>
            <strong>Presiding:</strong> {presiding}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span>
              <strong>Chorister:</strong> <Values value={chorister}>{chorister}</Values>
            </span>
            <span>
              <strong>Organist:</strong> <Values value={organist}>{organist}</Values>
            </span>
          </div>
          <div>
            <strong>Announcements:</strong>
            <Lines />
          </div>
          <div>
            <strong>Opening Hymn:</strong>{' '}
            <Values value={opening_hymn}>
              #{opening_hymn} - {opening_hymn_title}
            </Values>
          </div>
          <div>
            <strong>Invocation:</strong> <Values value={invocation}>{invocation}</Values>
          </div>
          <div>
            <SubHeading>RELEASING</SubHeading>
            <Words>
              “[Name] has been released as [position], and we propose that he [or she] be given a vote of thanks for his
              [or her] service. Those who wish to express their appreciation may manifest it by the uplifted hand.”
            </Words>
            <Lines lines={6} />
          </div>
          <div>
            <SubHeading>SUSTAINING</SubHeading>
            <Words>
              “[Name] has been called as [position], and we propose that he [or she] be sustained. We ask that they
              stand as their name is read Those in favor may manifest it by the uplifted hand. Those opposed, if any,
              may manifest it.
            </Words>
            <Lines lines={6} />
          </div>
          <h3>Stake Business:</h3>
          <div>
            <h3>Bishop Business:</h3>
            <Lines lines={2} />
          </div>
        </Col>
        <Col>
          <h3>We Will Now Prepare For The Sacrament</h3>
          <div>
            <strong>Sacrament Hymn:</strong>{' '}
            <Values value={sacrament_hymn}>
              #{sacrament_hymn} - {sacrament_hymn_title}
            </Values>
          </div>
          <Words>
            <strong>BREAD DC 20:77</strong> O God, the Eternal Father, we ask thee in the name of thy Son, Jesus Christ,
            to bless and sanctify this bread to the souls of all those who partake of it, that they may eat in
            remembrance of the body of thy Son, and witness unto thee, O God, the Eternal Father, that they are willing
            to take upon them the name of thy Son, and always remember him and keep his commandments which he has given
            them; that they may always have his Spirit to be with them. Amen.
          </Words>
          <Words>
            <strong>WATER DC 20:78</strong> O God, the Eternal Father, we ask thee in the name of thy Son, Jesus Christ,
            to bless and sanctify this water to the souls of all those who drink of it, that they may do it in
            remembrance of the blood of thy Son, which was shed for them; that they may witness unto thee, O God, the
            Eternal Father, that they do always remember him, that they may have his Spirit to be with them. Amen.
          </Words>
          <h3>Thank Everyone For Their Reverence</h3>
          <h4>PROGRAM</h4>
          <div>
            {speakers
              .sort((a, b) => a.priority - b.priority)
              .map(({ value, ...rest }, index) => (
                <ProgramList key={`${value}-${index + 1}`}>{buildProgramItem({ ...rest, value })}</ProgramList>
              ))}
          </div>
          <h3>Thank Those Who Spoke and Music</h3>
          <div>
            <div>
              <strong>Closing Hymn:</strong>{' '}
              <Values value={closing_hymn}>
                #{closing_hymn} - {closing_hymn_title}
              </Values>
            </div>
            {closing_hymn_extra && <em>{closing_hymn_extra}</em>}
          </div>
          <div>
            <strong>Benediction:</strong> <Values value={benediction}>{benediction}</Values>
          </div>
        </Col>
      </Page>
    </>
  );
}

// Conducting.propTypes = {

// };

export default Conducting;
// #endregion component
// #endregion Conducting
