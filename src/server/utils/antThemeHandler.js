import theme from '../../configs/theme.config';

const { name, antdOverrides, variables } = theme;

function antdTheme() {
  const vars = variables[name];
  const ant = {};

  Object.keys(antdOverrides).forEach((prop) => {
    const val = antdOverrides[prop];
    if (!vars[val]) {
      ant[prop] = val;
    } else {
      ant[prop] = vars[val];
    }
  });

  return ant;
}

export default antdTheme();
