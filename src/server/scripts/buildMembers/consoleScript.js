Object.values(document.querySelector('.member-list').getElementsByTagName('tbody')[0].getElementsByTagName('tr')).map(
  (item) => {
    const name = item.getElementsByTagName('member-card').item(0).outerText.split(', ');
    const age = item.getElementsByClassName('age').item(0).innerText;

    return {
      firstName: name.at(1).split(' ').at(0),
      lastName: name.at(0),
      age,
    };
  }
);
