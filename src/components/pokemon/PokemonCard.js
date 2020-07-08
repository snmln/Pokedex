import axios from 'axios';
import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import Spinner from "../pokemon/spinner.gif.gif";


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

const Sprite = styled.img`
    width: 12em;
    height: 12em;
    display: none;
`;
const Card = styled.div`
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    &:hover{
     box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
    -moz-user-select:none;
    -website-user-select: none;
    -o-user-select:none;
    user-select:none;
    `;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active{
    text-decoration:none;
    }
`;

class PokemonCard extends Component {
    state = {
        name: '',
        imageURL: '',
        pokemonIndex: '',
        types: [],
        imageLoading: true,
        toManyRequests: false
    };


    async componentDidMount() {
        const { name, url } = this.props;
        const pokemonIndex = url.split('/')[url.split('/').length - 2];
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonRes = await axios.get(pokemonUrl);
        const types = pokemonRes.data.types.map(type => type.type.name);

        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`;
        this.setState({
            name,
            imageUrl,
            types,
            pokemonIndex
        })

    }

    render() {

        return (
            <div className="col-md-4 col-sm-2 mt-5">
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                    {this.state.types.slice(0, 1).map(type => (
                        <Card className="card"
                            key={type}

                            style={{
                                backgroundColor: `${TYPE_COLORS[type]}`,
                                color: 'white',

                            }}>
                            <h3 className='card-header'>
                                {
                                    this.state.name.toLowerCase().split(" ")
                                        .map(
                                            letter => letter.charAt(0).toUpperCase() + letter.substring(1))
                                        .join(" ")
                                }
                                <NumberFormat value={this.state.pokemonIndex} prefix={'#'} allowLeadingZeros={true} displayType={'text'} className="d-inline float-right h6 "></NumberFormat>
                            </h3>
                            {/*Pills and coloring*/}
                            <div className="float-right ml-3 mt-2">
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
                            {/*Pills and coloring^^^^^^^^^^^^*/}
                            {this.state.imageLoading ? (
                                <img src={Spinner} style={{ width: '5em', height: '5em' }}
                                    className="card-img-top rounded mx-auto mt-2"></img>
                            ) : null}
                            <Sprite className="card-img-top rounded mx-auto mt-2"
                                onLoad={() => this.setState({ imageLoading: false })}
                                onError={() => this.setState({ toManyRequests: true })}
                                src={this.state.imageUrl}
                                style={
                                    this.state.toManyRequests ? { display: "none" } :
                                        this.state.imageLoading ? null : { display: "block" }
                                }
                            />
                            {this.state.toManyRequests ? (<h6 className="mx-auto">
                                <span className="badge badge-danger mt-2">
                                    Too many requests
                        </span>
                            </h6>) : null}
                            <div className='card-body mx-auto'>
                                {/*<h6 className='card-title'>
                                {
                                    this.state.name.toLowerCase().split(" ")
                                        .map(
                                            letter => letter.charAt(0).toUpperCase() + letter.substring(1))
                                        .join(" ")
                                }
                            </h6>*/}
                            </div>
                        </Card>
                    ))}
                </StyledLink>
            </div>
        );
    }
}

export default PokemonCard;