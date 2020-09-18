import { useEffect } from 'react';
import { initialize, pageview, event } from 'react-ga';
import { useLocation } from 'react-router-dom';

import env from '../../../generatedFiles/envConfig.json';

export default function GAInitialize() {
    const gaTrackingId = env.analytics;
    const { pathname } = useLocation();

    useEffect(() => {
        initialize(gaTrackingId, {
            debug: false,
            gaOptions: {
                siteSpeedSampleRate: 50,
                alwaysSendReferrer: true
            }
        });
    }, []);
    useEffect(() => {
        if (pathname) pageview(pathname);
    }, [pathname]);

    return null;
}

/* ***** EVENTS *******
   https://github.com/react-ga/react-ga

** category **
   - Required. A top level category for these events. E.g. 'User', 'Navigation', 'App Editing', etc.
** action **
   - Required. A description of the behaviour. E.g. 'Clicked Delete', 'Added a component', 'Deleted account', etc.
** value **
   - Optional. A means of recording a numerical value against an event. E.g. a rating, a score, etc.
** label **
   - Optional. More precise labelling of the related action. E.g. alongside the 'Added a component'
     action, we could add the name of a component as the label. E.g. 'Survey', 'Heading', 'Button', etc.
** nonInteraction **
   - Optional. If an event is not triggered by a user interaction, but instead by our code (e.g. on page load, it
     should be flagged as a nonInteraction event to avoid skewing bounce rate data.
** transport **
   - Optional. This specifies the transport mechanism with which hits will be sent. Valid values include 'beacon', 'xhr', or 'image'.
*/
export function GAEvent(options) {
    event(options);
}
