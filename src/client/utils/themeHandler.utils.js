import themeConfig from '../../configs/theme.config';

/* To get variable values when outside of Styled Components */
export const theme = (varName) => {
  const { name, variables } = themeConfig;
  const allVars = variables[name];

  if (varName) return allVars[varName] || null;

  return allVars;
};

/* For styled components */
export default (variable, log) => (props) => {
  const val = props?.theme[variable];
  const css = 'padding: 5px 10px; background-color: #de0f0f; color: white; font-family: arial; font-size: 120%;';
  const logCss =
    'padding: 5px 10px; background-color: #336699; border-radius: 5px; color: white; font-size: 140%; font-family: arial;';
  let showLog = log;

  if (!val) showLog = true;
  if (showLog) console.group('%cTheme Variables', logCss, '\n', props?.theme);
  if (!val) return console.error(`%cError: Your theme variable "${variable}" is not found in the current theme.`, css);
  console.groupEnd();

  return val;
};
