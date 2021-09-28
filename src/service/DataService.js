import axios from "axios";

const corsAnywhere = 'https://damp-basin-43962.herokuapp.com/'
const dataGovURL = corsAnywhere + 'https://api.dane.gov.pl';

// Imiona nadane dzieciom w Polsce w latach 2000-2019 - imię pierwsze
export const getCountForYears2000To2019 = (name, gender) => {
    const req = {
        resourcesId: 21458,
        nameCol: 'col2',
        yearCol: 'col1',
        countCol: 'col3',
        genderCol: 'col4'
    }
    const headers = {
        'X-API-VERSION': '1.4',
        'Content-Type': 'application/json'
    };

    let nameQuery = `${req.nameCol}:"${name.toUpperCase()}"`;
    let genderQuery = `${req.genderCol}:"${gender.toUpperCase()}"`;

    return axios.get(`${dataGovURL}/resources/${req.resourcesId}/data?page=1&per_page=100&q=${nameQuery} AND ${genderQuery}&sort=col1`, {headers})
        .then(response =>
            response.data.data.map(data => {
                return {
                    name: data.attributes[req.nameCol].val,
                    year: data.attributes[req.yearCol].val,
                    count: data.attributes[req.countCol].val
                }
            })
                .filter(data => data.name === name.toUpperCase()));
}

// Imiona żeńskie nadane dzieciom w Polsce w 2019 r. wg województw - imię pierwsze
export const getCountFor2019InMalopolska = (name, gender) => {
    let womanResourceId = 28022;
    let manResourceId = 28023;
    const req = {
        voivodeshipNumCol: 'col1',
        voivodeshipCol: 'col2',
        nameCol: 'col3',
        countCol: 'col5'
    }
    const malopolskaNum = 12;

    const query = `${req.nameCol}:%22${name.toUpperCase()}%22%20AND%20${req.voivodeshipNumCol}:${malopolskaNum}`;
    const womanUrl = `${dataGovURL}/resources/${womanResourceId}/data?page=1&per_page=100&q=${query}&sort=`;
    const manUrl = `${dataGovURL}/resources/${manResourceId}/data?page=1&per_page=100&q=${query}&sort=`;
    const headers = {
        'X-API-VERSION': '1.4',
        'Content-Type': 'application/json'
    };
    return axios.get(gender === 'K' ? womanUrl : manUrl, {headers})
        .then(response => mapResponseToData(response, req, name))
        .then(data => {
            if (data) {
                return data;
            }
            return {
                name: name.toUpperCase(),
                count: 0
            };
        });
}

const mapResponseToData = (response, req, name) => {
    const data = response.data.data.map(data => {
        return {
            name: data.attributes[req.nameCol].val,
            count: data.attributes[req.countCol].val
        }
    })
        .filter(data => data.name === name.toUpperCase());
    return data.length ? data[0] : null;
}

