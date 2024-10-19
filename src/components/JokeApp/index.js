import {Component} from 'react';
import Axios from 'axios'
class JokeApp extends Component{
    state={
        filters:{
            category:"",
            nsfw: false,
            sexist: false,
            political:false,
            racist:false,
            explicit:false,
            religious:false,
            safe:false
        },
        jokes:[],
    }

    getJokes=async()=>{
        const response=await Axios.get("http://localhost:5000/getjokes");
        console.log(response);
        const {data} = response;
        console.log(data);
        this.setState({
            jokes:data,
        })
    }

    componentDidMount(){
        this.getJokes();
    }

    getRandom=()=>{
        const {jokes}=this.state;
        if (jokes.length === 0) return null;
        const random=Math.floor(Math.random()*jokes.length);
        return random;
    }

    render(){
        const randomNum=this.getRandom();
        const {jokes}=this.state;
        const jokeToRender = jokes.find(item => item.id === randomNum);
        return(
            <div>
            {
                    jokeToRender? 
                    <div>
                        <h1>{jokeToRender.setup}</h1>
                        <h1>{jokeToRender.delivery}</h1>
                    </div>
                    : null
            }
            </div>
        )
    }
}

export default JokeApp