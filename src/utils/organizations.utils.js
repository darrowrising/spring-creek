import {
  colorOrgStake,
  colorOrgOther,
  colorOrgNeighborhood,
  colorOrgWard,
  colorOrgPrimary,
  colorOrgEldersQuorum,
  colorOrgReliefSociety,
  colorOrgYoungMen,
  colorOrgYoungWomen,
  colorOrgYouth,
} from '../styles/variables';

export const getOrganizationColor = (org) => {
  switch (org) {
    case 'Stake':
      return colorOrgStake;
    case 'Neighborhood':
      return colorOrgNeighborhood;
    case 'Ward':
      return colorOrgWard;
    case 'Primary':
      return colorOrgPrimary;
    case 'Young Men':
      return colorOrgYoungMen;
    case 'Young Women':
      return colorOrgYoungWomen;
    case 'Elders Quorum':
      return colorOrgEldersQuorum;
    case 'Relief Society':
      return colorOrgReliefSociety;
    case 'Combined YM/YW':
      return colorOrgYouth;
    default:
      return colorOrgOther;
  }
};

export const useFindMember =
  (members) =>
  ({ name = '', id, calling, callings }) => {
    if (callings)
      return members.filter(({ callings: memberCallings = [] }) =>
        memberCallings.some((call) => callings.includes(call))
      );
    if (calling)
      return members.find(({ callings: memberCallings = [] }) => memberCallings.some((call) => call === calling));
    if (id) return members.find(({ uid }) => uid === id);
    if (name)
      return members.find(({ preferredName, firstName, lastName }) => {
        const first = preferredName || firstName;
        return name.includes(first) && name.includes(lastName);
      });

    return '';
  };
