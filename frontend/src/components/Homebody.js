import './Homebody.css'
import pic from '../images/bodyimage.JPG'

const Homebody = () =>{
    return(
        <>
        <div className="container">
            <img src={pic} alt='pic' />
            <div className='inner1'>
                <p><span>A</span>re you a Loner in college??</p>
                <p>Lets find you a Trek buddy!!</p>
                <a href='/signup'>Signup</a>
                <a href='/login'>Login</a>

            </div>
        </div>
        </>
    )
}
export default Homebody