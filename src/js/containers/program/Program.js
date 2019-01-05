import React, { Component } from 'react';
import {
    func, arrayOf, string, shape, bool
} from 'prop-types';
import { connect } from 'react-redux';
import shortId from 'shortid';

import Leaders from '../../components/leaders/Leaders';
import { getProgramData } from './programActions';
import { setProgramViewState } from './programViewStates';
// import { setProgramEntities } from './programEntities';

import './program.less';

class Program extends Component {
    static propTypes = {
        getProgram: func,
        program: shape({
            speakers: arrayOf(
                string
            ),
            fast_sunday: bool,
            conference: bool
        })
    };

    static defaultProps = {
        getProgram: null,
        program: {
            speakers: []
        }
    }

    componentDidMount() {
        const { getProgram } = this.props;
        getProgram();
    }

    handleFirstSpeakers = () => {
        const { program } = this.props;
        const { speakers, fast_sunday, conference } = program;
        const numberOfSpeakers = speakers?.length;
        const onlyOneSpeaker = numberOfSpeakers === 1;
        let template = <Leaders className="speaker" title="Speaker" value="TBA" />;

        if (fast_sunday || conference || onlyOneSpeaker) {
            template = <div className="testimony-meeting center bold">{speakers[0]}</div>;
        } else if (numberOfSpeakers >= 3) {
            template = [
                <Leaders key={shortId.generate()} className="speaker" title="Speaker" value={speakers[0]} />,
                <Leaders key={shortId.generate()} className="speaker" title="Speaker" value={speakers[1]} />
            ];
        } else if (numberOfSpeakers === 2) {
            template = <Leaders className="speaker" title="Speaker" value={speakers[0]} />;
        }

        return template;
    }

    handleLastSpeakers = () => {
        const { program } = this.props;
        const { speakers } = program;
        const numberOfSpeakers = speakers?.length;
        let template = <Leaders className="speaker" title="Speaker" value="TBA" />;
        console.log('numberOfSpeakers:', numberOfSpeakers);
        if (numberOfSpeakers === 4) {
            template = [
                <Leaders key={shortId.generate()} className="speaker" title="Speaker" value={speakers[2]} />,
                <Leaders key={shortId.generate()} className="speaker" title="Speaker" value={speakers[3]} />
            ];
        } else if (numberOfSpeakers === 3) {
            template = <Leaders className="speaker" title="Speaker" value={speakers[2]} />;
        } else if (numberOfSpeakers === 2) {
            template = <Leaders className="speaker" title="Speaker" value={speakers[1]} />;
        } else if (numberOfSpeakers === 1) {
            template = null;
        }

        return template;
    }

    render() {
        const { program } = this.props;

        return (
            <div className="program-container page center">
                <div className="center">
                    <h1 className="page-header">Sacrament Meeting</h1>
                    <div className="date">{program.date}</div>
                </div>

                <Leaders title="Presiding" value={program.presiding} />
                <Leaders title="Conducting" value={program.conducting} />
                <Leaders title="Chorister" value={program.chorister} />
                <Leaders title="Organist" value={program.organist} />

                <h3 className="center">Welcome</h3>

                <Leaders
                    title="Opening Hymn"
                    value={program.opening_hymn}
                    subValue={program.opening_hymn_title}
                />

                <Leaders title="Invocation" value={program.invocation} />

                <h3 className="center">Ward and Stake Business</h3>

                <Leaders
                    title="Sacrament Hymn"
                    value={program.sacrament_hymn}
                    subValue={program.sacrament_hymn_title}
                />

                <h3 className="center bold sacrament">Administration of the Sacrament</h3>

                { this.handleFirstSpeakers() }
                {
                    program.intermediate_hymn && (
                        <Leaders
                            className="intermediate-hymn"
                            title="Intermediate Hymn"
                            value={program.intermediate_hymn}
                            subValue={program.intermediate_hymn_title}
                        />
                    )
                }
                {
                    program.musical_number && (
                        <div className="center musical-number-wrapper">
                            {
                                program.musical_number.map(text => <div key={shortId.generate()} className="musical-number">{text}</div>)
                            }
                        </div>
                    )
                }
                { this.handleLastSpeakers() }

                <Leaders
                    title="Closing Hymn"
                    value={program.closing_hymn}
                    subValue={program.closing_hymn_title}
                    className="closing-hymn"
                />

                <Leaders title="Benediction" value={program.benediction} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    program: setProgramViewState(state)
});

const mapDispatchToProps = {
    getProgram: getProgramData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Program);
