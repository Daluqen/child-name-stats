import React, {useState} from "react";
import {getCountFor2019InMalopolska, getCountForYears2000To2019} from "../../service/dataService";
import "./NamesStats.css"
import LineChart from "../chart/LineChart";
import BarChart from "../chart/BarChart";
import {Button, FormControl, InputGroup} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import {Plus} from "react-bootstrap-icons";

const createArrayFromRange = (start, end) => {
    return Array.from({length: end - start + 1}, (v, k) => k + start)
}

const colorList = [
    'rgb(0,35,255)',
    'rgb(0,255,0)',
    'rgb(253,220,0)',
    'rgb(255,0,0)',
    'rgb(0, 255, 255)',
    'rgb(187,0,255)',
    'rgb(200,130,123)',
    'rgb(36,32,32)',
    'rgb(38,75,102)',
    'rgb(255,99,132)',
    'rgb(58,96,9)',
    'rgb(105,176,176)',
    'rgb(255,150,2)',
    'rgb(47,1,72)',
    'rgb(140,135,135)'];

const getRandomColor = (i) => {
    if (i < 15) {
        return colorList[i];
    }
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}


const NamesStats = () => {
    const [loadingYears, setLoadingYears] = useState(false);
    const [loadingVoivodeship, setLoadingVoivodeship] = useState(false);
    const [yearRanges] = useState(createArrayFromRange(2000, 2019));
    const [inputName, setInputName] = useState('');
    const [gender, setGender] = useState('K');
    const [lineChartData, setLineChartData] = useState({
        labels: yearRanges,
        datasets: []
    });
    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            borderColor: colorList[0],
            backgroundColor: colorList[0]
        }]
    });

    const addNameHandler = () => {
        if (inputName) {
            addName(inputName, gender);
            setInputName('');
        }
    }

    const addName = (newName, gender) => {
        const color = getRandomColor(lineChartData.datasets.length);
        setLoadingYears(true);
        setLoadingVoivodeship(true);
        getCountForYears2000To2019(newName.trim(), gender)
            .then(data => {
                const yearsData = createYearsData(newName, data, color)
                setLineChartData({
                    ...lineChartData,
                    datasets: [...lineChartData.datasets, yearsData]
                });
                setLoadingYears(false);
            })
            .catch(() => setLoadingYears(false));
        getCountFor2019InMalopolska(newName.trim())
            .then(data => {
                if (data && data.name && data.count) {
                    const barChartLabels = [...barChartData.labels, data.name.toUpperCase()]
                    const barChartDataset = {...barChartData.datasets[0]}
                    barChartDataset.data = [...barChartDataset.data, data.count];
                    setBarChartData({...barChartData, labels: barChartLabels, datasets: [barChartDataset]})
                }
                setLoadingVoivodeship(false);
            })
            .catch(() => setLoadingVoivodeship(false));

    }


    const createYearsData = (name, stats, color) => {
        return {
            label: name.toUpperCase(),
            data: extractCountData(stats),
            fill: false,
            borderColor: color,
            backgroundColor: color
        };
    }

    const extractCountData = stats => {
        return yearRanges.map(year => {
            let extractedStat = stats.find(stat => stat.year === year);
            return extractedStat != null ? extractedStat.count : 0;
        })
    }

    return (
        <div className={'NameStats'}>
            <InputGroup className={'inputs p-2'}>
                <FormControl className={'col-5 mr-3'}
                             value={inputName}
                             onChange={(event) => setInputName(event.target.value)}
                             placeholder={'Imię'}
                />
                <FormControl className={'col-4 mr-3'} as="select" value={gender}
                             onChange={event => setGender(event.target.value)}>
                    <option value={'K'}>Kobieta</option>
                    <option value={'M'}>Mężczyzna</option>
                </FormControl>
                <Button className={'col-2'} onClick={addNameHandler} disabled={loadingYears || loadingVoivodeship}>
                    {loadingYears || loadingVoivodeship ? <Spinner animation={'border'}/> : <Plus size={25}/>}
                </Button>
            </InputGroup>
            <hr/>
            {lineChartData.datasets.length ?
                <LineChart data={lineChartData} title={'Imiona w latach 2000-2019'}/> : null}
            {barChartData.labels.length ? <BarChart data={barChartData} title={'Województwo Małopolskie 2019'}/> : null}
        </div>
    )
}

export default NamesStats;