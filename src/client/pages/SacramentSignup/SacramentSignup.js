import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// components
import Layout from '../../layouts/Old/Old';
// utils
import { buildCalendlyScript, removeCalendlyScript } from './SacramentSignup.utils';
import { dayjs, comingSunday } from '../../utils/date.utils';
// configs
import { calendlyDate, calendlyMonth } from '../../../configs/dateFormats.configs';

let url = 'https://calendly.com/springcreek/sacrament-meeting';

function SacramentSignup() {
    // hooks
    const { date } = useParams();
    // data
    let calDate = dayjs().format();
    const validDate = date ? dayjs(date, calendlyDate).isValid() : false;

    if (validDate) {
        calDate = date;
    } else {
        calDate = comingSunday.format(calendlyDate);
    }

    url = `${url}?month=${dayjs(calDate, calendlyDate).format(calendlyMonth)}&date=${calDate}`;

    useEffect(() => {
        buildCalendlyScript();
        return removeCalendlyScript();
    }, []);

    return (
        <Layout responsive>
            <div className="calendly-inline-widget" data-url={url} style={{ minWidth: '320px', height: '630px' }} />
        </Layout>
    );
}

export default SacramentSignup;
