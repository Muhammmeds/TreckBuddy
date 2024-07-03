import './Homebody.css'
import pic from '../images/bodyimage.JPG'
import {Link} from 'react-router-dom'

const Homebody = () =>{
    return(
        <>
        <div className="container">
            <img src={pic} alt='pic' />
            <div className='inner1'>
                <p><span>D</span>o you want to make friends in college??</p>
                <p>Lets find you a trek <br></br> buddy!!</p>
                <Link to='/signup'>Signup</Link>
                <Link to='/login'>Login</Link>

            </div>
        </div>
        </>
    )
}
export default Homebody