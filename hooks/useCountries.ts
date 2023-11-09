import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlang: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  const getAllCountries = () => formattedCountries;

  const getByValue = (value: string) => {
    return formattedCountries.find((country) => country.value === value);
  };

  return {
    getAllCountries,
    getByValue,
  };
};

export default useCountries;
