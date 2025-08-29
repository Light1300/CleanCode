import {Quote} from "../components/Quote"
import {Auth} from "../components/Auth"

export const Signup = () => {
    return <div>
        <div className="grid grid-cols-2">
                <div className=" justify-center "> 
                    <Auth/>
                </div>
        <Quote/>
        </div>
    </div>   

}