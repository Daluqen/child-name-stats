import React, {useEffect, useState} from "react";
import {getCountFor2019InMalopolska, getCountForYears2000To2019} from "../../service/dataService";
import MyChart from "../chart/MyChart";
import "./NamesStats.css"

const NamesStats = () => {
    const initData = false;
    let [inputName, setInputName] = useState('');
    let [yearsSeries, setYearsSeries] = useState([]);
    // let [voivodeshipSeries, setVoivodeshipSeries] = useState({label: 'Voivodeship Series', data: []});
    let [voivodeshipSeries, setVoivodeshipSeries] = useState({label: 'Voivodeship Series', data: []});

    const addNameHandler = () => {
        if (inputName) {
            addName(inputName);
            setInputName('');
        }
    }

    const addName = (newName) => {
        getCountForYears2000To2019(newName.trim())
            .then(data => {
                const series = createYearsSeries(newName, data)

                setYearsSeries([...yearsSeries, series]);
            });
        getCountFor2019InMalopolska(newName.trim())
            .then(data => {
                if (data && data.name && data.count) {
                    const temp = {...voivodeshipSeries}
                    temp.data = [...voivodeshipSeries.data, [data.name, data.count]];
                    setVoivodeshipSeries(temp);
                }
            })
    }

    useEffect(() => {
        if (initData) {
            const names = [
                'Lidia',
                'Joanna',
                'Anna',
                'Hanna',
                'Karolina',
                // 'Julia',
                'Malwina',
                'Ewa',
                'Alicja',
                'Alina'];
            Promise.all(names.map(name => getCountForYears2000To2019(name)))
                .then(result => Promise.all(result.map(data => createYearsSeries(data[0].name, data))))
                .then(series => setYearsSeries(series));
            Promise.all(names.map(name => getCountFor2019InMalopolska(name)))
                .then(result => Promise.all(result.reduce((sum, current) => sum.concat([[current.name, current.count]]), [])))
                .then(allSeries => {
                    const temp = {...voivodeshipSeries}
                    temp.data = [...allSeries];
                    setVoivodeshipSeries(temp);
                })
        }
    }, []);


    const createYearsSeries = (name, stats) => {
        return {
            label: name,
            data: stats.map((stat) => [stat.year, stat.count])
        };
    }

    return (
        <>
            <input value={inputName} onChange={(event) => setInputName(event.target.value)}/>
            <button onClick={addNameHandler}> Add Name</button>
            <br/>
            <hr/>
            <div style={{
                display: "flex",
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '80%'
                }}>
                    <h1 style={{
                        textTransform: "capitalize"
                    // }}>Years</h1>
                    }}>Imiona w latach 2000-2019</h1>
                    <MyChart data={yearsSeries} type={'line'}/>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '80%'
                }}>
                    <h1 style={{
                        textTransform: "capitalize"
                    // }}>Voivodeship (malopolska) 2019</h1>
                    }}>Województwo Małopolskie 2019</h1>
                    <MyChart data={[voivodeshipSeries]} type={'bar'}/>
                </div>
            </div>
        </>
    )
}

export default NamesStats;