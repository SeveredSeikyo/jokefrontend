import {Component} from 'react';
import Axios from 'axios'
import "./index.css"

const JokeItem=({joke})=>{
    return(
        <>
            <h3>{joke.setup}</h3>
            {joke.delivery!==""?<p>{joke.delivery}</p>:null}
        </>
    )
}

class JokeApp extends Component{
    state = {
        filters: {
            category: "dadjoke",
            jokeType: "safe",
            count: 1,
        },
        jokes: [],
        filteredJokes:[],
        jokeToRender:null,
    };

    
    getJokes = async () => {
        const response = await Axios.get("https://jokes-api-1qwo.onrender.com/getjokes");
        const { data } = response;

        this.setState({
            jokes: data,
            filteredJokes: [],
            jokeToRender: this.getRandomJoke(data), // Select a random joke after fetching all jokes
        });
    };

    getRandomJoke = (jokes) => {
        if (jokes.length === 0) return null; // Return null if no jokes are available
        const randomIndex = Math.floor(Math.random() * jokes.length);
        return jokes[randomIndex]; // Return a random joke from the jokes array
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            filters: {
                ...prevState.filters,
                [name]: value,
            }
        }));
    }

    /*handleFormSubmit=async(event)=>{
        event.preventDefault();
        const {jokes,filters}=this.state;
        let {category, jokeType, count}=filters;
        if(count>5){
            count=5;
        }
        console.log(filters);
        const response=await Axios.get(`https://jokes-api-1qwo.onrender.com/joke?category=${category}&jokeType=${jokeType}&count=${count}`);
        console.log(response);
        const {data}=response;
        console.log(data);
        this.setState({
            filteredJokes: data,
            jokeToRender:this.getRandomJoke(data),
        });
    }*/

    handleFormSubmit = async (event) => {
        event.preventDefault();
        const { jokes, filters } = this.state;
        let { category, jokeType, count } = filters;
    
        if (count > 5) {
            count = 5; // Limiting the maximum count to 5
        }
    
        // Filter jokes based on category and joke type
        const categorisedJokes = jokes.filter(joke => {
            // Check if category matches or if category is not provided
            const categoryMatch = category === "" || joke.category === category;
    
            // Check if jokeType matches (e.g., nsfw, sexist, safe, etc.)
            const jokeTypeMatch = jokeType === "" || joke[jokeType] === 1;
    
            return categoryMatch && jokeTypeMatch;
        });

        console.log(categorisedJokes);
    
        // Shuffle and select random jokes
        const randomJokes = this.getRandomJokes(categorisedJokes, count);
    
        this.setState({
            filteredJokes: randomJokes,
            jokeToRender: this.getRandomJoke(jokes), // Optional: Get a random joke from the selected random jokes
        });
    }

    // Function to shuffle array and select random items
    getRandomJokes = (jokes, count) => {
        const shuffled = jokes.slice(); // Make a copy of the array
    
        // Fisher-Yates shuffle algorithm
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
        }
    
        // Return the first `count` items from the shuffled array
        return shuffled.slice(0, count);
    }


    componentDidMount(){
        this.getJokes();
    }

    renderJokeForm(joke){
        const {filters, filteredJokes}=this.state;
        return(
            <form action="submit" className="form-container" onSubmit={this.handleFormSubmit}>
                <h1>Choose your type &#128540;</h1>
                <label htmlFor="category">Select Category:</label>
                <select name="category" id="category" value={filters.category} onChange={this.handleInputChange}>
                    <option value="">Select Category</option>
                    <option value="Programming">Programming</option>
                    <option value="Pun">Pun</option>
                    <option value="Misc">Misc</option>
                    <option value="Dark">Dark</option>
                    <option value="Spooky">Spooky</option>
                    <option value="Christmas">Christmas</option>
                    <option value="dadjoke">Dadjoke</option>
                    <option value="chuckjoke">Chuckjoke</option>
                </select>
                <label htmlFor="jokeType">Select your Kindof Joke:</label>
                <select name="jokeType" id="jokeType" value={filters.jokeType} onChange={this.handleInputChange}>
                    <option value="">Select Joke-Type</option>
                    <option value="nsfw">NSFW</option>
                    <option value="sexist">Sexist</option>
                    <option value="political">Political</option>
                    <option value="racist">Racist</option>
                    <option value="explicit">Explicit</option>
                    <option value="religious">Religious</option>
                    <option value="safe">Safe</option>
                </select>
                <label htmlFor="count">How many would you like? &#129300;</label>
                <input type="number" id="count" name="count" value={filters.count} onChange={this.handleInputChange}/>
                {filteredJokes.length>0?
                (
                    filteredJokes.map(filterjoke=>{
                    return <JokeItem joke={filterjoke} key={filterjoke.id}/>
                })
                ): <JokeItem joke={joke}/>}
                <button type="submit" className="submit-button">Get Joke</button>

                <p>*please select only upto 5 Jokes at a time. If above 5 are selected, system will return only 5*<br/>
                *default category is set to dadjoke. change it if needed*<br/>
                *if No Matched Jokes found then it returns random Joke*</p>
            </form>
        )
    }

    render(){
        const {jokeToRender}=this.state
        return(
            <div className="main-container">
            {
                    jokeToRender? 
                    <div className="main-container">
                        {this.renderJokeForm(jokeToRender)}
                    </div>
                    : null
            }
            </div>
        )
    }
}

export default JokeApp
