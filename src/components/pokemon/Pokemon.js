import axios from 'axios';
import React, { Component } from 'react';

const TYPE_COLORS = {
    bug: 'rgba(177, 193, 46, 0.5)',
    dark: 'rgba(79, 58, 45, 0.5)',
    dragon: 'rgba(117, 94, 223, 0.5)',
    electric: 'rgba(252, 188, 23, 0.5)',
    fairy: 'rgba(244, 177, 244, 0.5)',
    fighting: 'rgba(130, 53, 29, 0.5)',
    fire: 'rgba(231, 59, 12, 0.5)',
    flying: 'rgba(163, 179, 247, 0.5)',
    ghost: 'rgba(96, 96, 178, 0.5)',
    grass: 'rgba(116, 194, 54, 0.5)',
    ground: 'rgba(211, 179, 87, 0.5)',
    ice: 'rgba(163, 231, 253, 0.5)',
    normal: 'rgba(200, 196, 188, 0.5)',
    poison: 'rgba(147, 69, 148, 0.5)',
    psychic: 'rgba(237, 72, 130, 0.5)',
    rock: 'rgba(185, 161, 86, 0.5)',
    water: 'rgba(50, 149, 246, 0.5)',
    steel: 'rgba(158, 158, 158, 0.5)'
};

class Pokemon extends Component {
    state = {
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: '',
            attack: "",
            defense: "",
            speed: "",
            specialAttack: "",
            specialDefense: ""
        },
        heigh: "",
        weight: "",
        eggGroup: "",
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: ""
    };

    async componentDidMount() {
        const { pokemonIndex } = this.props.match.params;

        //URLS for information

        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        const pokemonRes = await axios.get(pokemonUrl);
        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.front_default;

        let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

        pokemonRes.data.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                case 'defense':
                    defense = stat['base_stat'];
                    break;
                case 'speed':
                    speed = stat['base_stat'];
                    break;
                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefense = stat['base_stat'];
                    break;
            }
        });
        //convert decimeters to feet... the +0.0001 * 100 ) /100 is for rounding to 2 decimal places
        const height = Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100;
        //convert to lbs... the +0.0001 * 100 ) /100 is for rounding to 2 decimal places

        const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;

        const types = pokemonRes.data.types.map(type => type.type.name);
        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        });
        const evs = pokemonRes.data.stats.filter(stat => {
            if (stat.effort > 0) {
                return true;
            }
            return false;
        }).map(stat => {
            return `${stat.effort} ${stat.stat.name.toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')}`
        }).join(', ');

        //Get pokemon description, catch rate, egg groups, gender ratio, hatch steps
        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if (flavor.language.name === 'en') {
                    description = flavor.flavor_text;

                }
            });
            const femaleRate = res.data['gender_rate'];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);
            const catchRate = Math.round(100 / 255) * res.data['capture_rate'];
            const eggGroups = res.data['egg_groups'].map(group => {
                return group.name.toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            }).join(', ');
            const hatchSteps = 255 * (res.data["hatch_counter"] + 1);
            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps
            });

        });
        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evs
        })


    }

    render() {
        return (
            <div>
                {this.state.types.slice(0, 1).map(type => (
                    <div className="container-fluid" >
                        <div className="col mt-5" >
                            <div className='card-header'
                                key={type}
                                style={{ backgroundColor: `${TYPE_COLORS[type]}` }}>
                                <div className="row">
                                    <div className="col-5">

                                        <div className="mx-auto display-4 font-weight-bold mb-2">{this.state.name.toLowerCase()
                                            .split('-')
                                            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                            .join(' ')}</div>
                                        {this.state.types.map(type => (
                                            <span
                                                key={type}
                                                className="badge badge-pill mr-1"
                                                style={{
                                                    backgroundColor: `${TYPE_COLORS[type]}`,
                                                    color: 'white'
                                                }}>
                                                {type.toLowerCase()
                                                    .split('-')
                                                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                                    .join(' ')}
                                        </span>
                                        ))}
                                    </div>
                                    <div className="col-7">
                                        <div className="float-right">
                                            <h5>#{this.state.pokemonIndex}</h5>

                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="col-md-7 mx-auto">
                                        <img
                                            src={this.state.imageUrl}
                                            className="card-img-top rounded  " />
                                    </div>
                                    <div className="row align-items-center">

                                        <div className="col-md-12">
                                            {/*Stats start*/}
                                            <div className="row align-items-center">
                                                <h6 className="col-12 col-md-3">
                                                    HP
                                    </h6>
                                                <div className="col-12 col-md-9">
                                                    <div className="progress">
                                                        <div className="progress-bar"
                                                            role="progressBar"
                                                            style={{ width: `${this.state.stats.hp}%` }}
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100">
                                                            <small>{this.state.stats.hp}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row align-items-center">
                                                <h6 className="col-12 col-md-3">
                                                    Attack
                                    </h6>
                                                <div className="col-12 col-md-9">
                                                    <div className="progress">
                                                        <div className="progress-bar"
                                                            role="progressBar"
                                                            style={{ width: `${this.state.stats.attack}%` }}
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100">
                                                            <small>{this.state.stats.attack}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row align-items-center">
                                                <h6 className="col-12 col-md-3">
                                                    Defense
                                    </h6>
                                                <div className="col-12 col-md-9">
                                                    <div className="progress">
                                                        <div className="progress-bar"
                                                            role="progressBar"
                                                            style={{ width: `${this.state.stats.defense}%` }}
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100">
                                                            <small>{this.state.stats.defense}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row align-items-center">
                                                <h6 className="col-12 col-md-3">
                                                    Speed
                                    </h6>
                                                <div className="col-12 col-md-9">
                                                    <div className="progress">
                                                        <div className="progress-bar"
                                                            role="progressBar"
                                                            style={{ width: `${this.state.stats.speed}%` }}
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100">
                                                            <small>{this.state.stats.speed}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row align-items-center">
                                                <h6 className="col-12 col-md-3">
                                                    Special Attack
                                    </h6>
                                                <div className="col-12 col-md-9">
                                                    <div className="progress">
                                                        <div className="progress-bar"
                                                            role="progressBar"
                                                            style={{ width: `${this.state.stats.specialAttack}%` }}
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100">
                                                            <small>{this.state.stats.specialAttack}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row align-items-center">
                                                <h6 className="col-12 col-md-3">
                                                    Special Defense
                                    </h6>
                                                <div className="col-12 col-md-9">
                                                    <div className="progress">
                                                        <div className="progress-bar"
                                                            role="progressBar"
                                                            style={{ width: `${this.state.stats.specialDefense}%` }}
                                                            aria-valuenow="25"
                                                            aria-valuemin="0"
                                                            aria-valuemax="100">
                                                            <small>{this.state.stats.specialDefense}</small>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col">
                                                <p className="p-2">{this.state.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <hr />
                                <div className="card-body">
                                    <h5 className="card-title text-center">
                                        Profile</h5>

                                    <div className="row">
                                        <div className="col-md-6">
                                            {/*Height*/}
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">Height: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="float-left">{this.state.height} ft.</h6>
                                                </div>
                                            </div>

                                            {/*weight*/}

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">Weight: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="float-left">{this.state.weight} lbs.</h6>
                                                </div>
                                            </div>

                                            {/*Catch Rate*/}

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">Catch Rate: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="float-left">{this.state.catchRate}%</h6>
                                                </div>
                                            </div>
                                            {/*Gender Ratio*/}

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">Gender Ratio: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="progress">
                                                        <div className="progress-bar"
                                                            role="progressbar"
                                                            style={{
                                                                width: `${this.state.genderRatioFemale}%`,
                                                                backgroundColor: "#C2185B"
                                                            }}
                                                            aria-valuenow="15"
                                                            aria-valuemax="100"
                                                            aria-valuemin="0">
                                                            <small>{this.state.genderRatioFemale}</small>
                                                        </div>
                                                        <div className="progress-bar"
                                                            role="progressbar"
                                                            style={{
                                                                width: `${this.state.genderRatioMale}%`,
                                                                backgroundColor: "#1976D2"
                                                            }}
                                                            aria-valuenow="30"
                                                            aria-valuemax="100"
                                                            aria-valuemin="0">
                                                            <small>{this.state.genderRatioMale}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-md-6">
                                            {/*Egg Groups*/}
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">Egg Groups: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="float-left">{this.state.eggGroups}</h6>
                                                </div>
                                            </div>
                                            {/*Hatch Steps:*/}
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">Hatch Steps: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="float-left">{this.state.hatchSteps}</h6>
                                                </div>
                                            </div>
                                            {/*Abilities*/}
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">Abilities: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="float-left">{this.state.abilities}</h6>
                                                </div>
                                            </div>
                                            {/*Evs*/}
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="float-right">EVs: </h6>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="float-left">{this.state.evs}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="card-footer text-muted">
                                Data From:
                    <a href='https://pokeapi.co/' target="_blank" className="card-link">
                                    PokeAPI.co
                    </a>
                            </div>
                        </div>
                    </div>))}
            </div>
        );
    }
}

export default Pokemon;

