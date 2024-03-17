import './Homebody.css'
import pic from '../images/bodyimage.JPG'
import {Link} from 'react-router-dom'

const Homebody = () =>{
    return(
        <>
        <div className="container">
            <img src={pic} alt='pic' />
            <div className='inner1'>
                <p><span>A</span>re you a Loner in college??</p>
                <p>Lets find you a Trek buddy!!</p>
                <Link to='/signup'>Signup</Link>
                <Link to='/login'>Login</Link>

            </div>
        </div>
        </>
    )
}
export default Homebody